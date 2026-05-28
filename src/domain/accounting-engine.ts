import "server-only";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_LEDGER_ACCOUNTS,
  assertBalancedLedger,
  expensePaidEntries,
  paymentReceivedEntries,
  depreciationEntries,
  computeMonthlyDepreciation,
  salaryPaidEntries,
  EXPENSE_CATEGORY_TO_ACCOUNT,
} from "@/domain/accounting";

type JournalLineInput = {
  accountCode: string;
  debit?: number;
  credit?: number;
  memo?: string;
};

export async function ensureDefaultChartOfAccounts(societyId: string) {
  await prisma.ledgerAccount.createMany({
    data: DEFAULT_LEDGER_ACCOUNTS.map((account) => ({
      societyId,
      code: account.code,
      name: account.name,
      type: account.type,
    })),
    skipDuplicates: true,
  });

  return prisma.ledgerAccount.findMany({
    where: { societyId, isActive: true },
    orderBy: [{ code: "asc" }],
  });
}

export async function nextJournalVoucherNumber(societyId: string, date = new Date()) {
  const year = date.getFullYear();
  const prefix = `JV-${year}-`;
  const count = await prisma.journalVoucher.count({
    where: {
      societyId,
      voucherNumber: { startsWith: prefix },
    },
  });

  return `${prefix}${String(count + 1).padStart(5, "0")}`;
}

export async function postJournalVoucher(params: {
  societyId: string;
  createdBy?: string;
  narration: string;
  voucherDate?: Date;
  lines: JournalLineInput[];
}) {
  if (params.lines.length < 2) {
    throw new Error("A journal voucher needs at least two ledger lines");
  }

  const normalizedLines = params.lines.map((line) => ({
    ...line,
    debit: Number(line.debit || 0),
    credit: Number(line.credit || 0),
  }));

  assertBalancedLedger(normalizedLines);
  await ensureDefaultChartOfAccounts(params.societyId);

  const accountCodes = normalizedLines.map((line) => line.accountCode);
  const accounts = await prisma.ledgerAccount.findMany({
    where: {
      societyId: params.societyId,
      code: { in: accountCodes },
      isActive: true,
    },
  });
  const accountByCode = new Map(accounts.map((account) => [account.code, account]));
  const missingAccounts = accountCodes.filter((code) => !accountByCode.has(code));

  if (missingAccounts.length > 0) {
    throw new Error(`Ledger account not found: ${missingAccounts.join(", ")}`);
  }

  const voucherDate = params.voucherDate || new Date();
  const voucherNumber = await nextJournalVoucherNumber(params.societyId, voucherDate);

  return prisma.$transaction(async (tx) => {
    const voucher = await tx.journalVoucher.create({
      data: {
        societyId: params.societyId,
        voucherNumber,
        voucherDate,
        narration: params.narration,
        createdBy: params.createdBy,
        postedAt: new Date(),
        lines: {
          create: normalizedLines.map((line) => ({
            accountId: accountByCode.get(line.accountCode)!.id,
            debit: line.debit,
            credit: line.credit,
            memo: line.memo,
          })),
        },
      },
      include: {
        lines: {
          include: { account: true },
        },
      },
    });

    const transaction = await tx.financialTransaction.create({
      data: {
        societyId: params.societyId,
        sourceType: "JOURNAL",
        sourceId: voucher.id,
        description: params.narration,
        transactionDate: voucherDate,
        createdBy: params.createdBy,
      },
    });

    await tx.ledgerEntry.createMany({
      data: normalizedLines.map((line) => ({
        societyId: params.societyId,
        transactionId: transaction.id,
        accountId: accountByCode.get(line.accountCode)!.id,
        debit: line.debit,
        credit: line.credit,
        memo: line.memo || params.narration,
        postedAt: voucherDate,
      })),
    });

    return voucher;
  });
}

export async function getTrialBalance(params: {
  societyId: string;
  from?: Date;
  to?: Date;
}) {
  const accounts = await ensureDefaultChartOfAccounts(params.societyId);
  const grouped = await prisma.ledgerEntry.groupBy({
    by: ["accountId"],
    where: {
      societyId: params.societyId,
      postedAt: {
        ...(params.from ? { gte: params.from } : {}),
        ...(params.to ? { lte: params.to } : {}),
      },
    },
    _sum: {
      debit: true,
      credit: true,
    },
  });

  const sums = new Map(grouped.map((row) => [row.accountId, row._sum]));
  const rows = accounts.map((account) => {
    const sum = sums.get(account.id);
    const debit = sum?.debit || 0;
    const credit = sum?.credit || 0;
    return {
      accountId: account.id,
      code: account.code,
      name: account.name,
      type: account.type,
      debit,
      credit,
      balance: debit - credit,
    };
  });

  return {
    rows,
    totals: {
      debit: rows.reduce((sum, row) => sum + row.debit, 0),
      credit: rows.reduce((sum, row) => sum + row.credit, 0),
    },
  };
}

// ── Account Ledger (Statement) ─────────────────────

export async function getAccountLedger(params: {
  societyId: string;
  accountCode: string;
  from?: Date;
  to?: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);
  const account = await prisma.ledgerAccount.findFirst({
    where: { societyId: params.societyId, code: params.accountCode, isActive: true },
  });
  if (!account) throw new Error(`Account ${params.accountCode} not found`);

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      societyId: params.societyId,
      accountId: account.id,
      postedAt: {
        ...(params.from ? { gte: params.from } : {}),
        ...(params.to ? { lte: params.to } : {}),
      },
    },
    include: { transaction: true },
    orderBy: { postedAt: "asc" },
  });

  let runningBalance = 0;
  const rows = entries.map((entry) => {
    runningBalance += entry.debit - entry.credit;
    return {
      id: entry.id,
      date: entry.postedAt,
      memo: entry.memo,
      debit: entry.debit,
      credit: entry.credit,
      balance: runningBalance,
      sourceType: entry.transaction.sourceType,
    };
  });

  return { account, rows, closingBalance: runningBalance };
}

// ── Income & Expenditure Statement ────────────────

export async function getIncomeExpenditure(params: {
  societyId: string;
  from: Date;
  to: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const accounts = await prisma.ledgerAccount.findMany({
    where: { societyId: params.societyId, isActive: true },
  });

  const incomeAccounts = accounts.filter((a) => a.type === "INCOME");
  const expenseAccounts = accounts.filter((a) => a.type === "EXPENSE");

  const grouped = await prisma.ledgerEntry.groupBy({
    by: ["accountId"],
    where: {
      societyId: params.societyId,
      postedAt: { gte: params.from, lte: params.to },
    },
    _sum: { debit: true, credit: true },
  });

  const sums = new Map(grouped.map((r) => [r.accountId, r._sum]));

  const incomeRows = incomeAccounts.map((a) => {
    const s = sums.get(a.id);
    const net = (s?.credit ?? 0) - (s?.debit ?? 0);
    return { code: a.code, name: a.name, amount: net };
  });

  const expenseRows = expenseAccounts.map((a) => {
    const s = sums.get(a.id);
    const net = (s?.debit ?? 0) - (s?.credit ?? 0);
    return { code: a.code, name: a.name, amount: net };
  });

  const totalIncome = incomeRows.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRows.reduce((sum, r) => sum + r.amount, 0);

  return {
    from: params.from,
    to: params.to,
    income: incomeRows.filter((r) => r.amount !== 0),
    expenses: expenseRows.filter((r) => r.amount !== 0),
    totalIncome,
    totalExpense,
    surplus: totalIncome - totalExpense,
  };
}

// ── Balance Sheet ─────────────────────────────────

export async function getBalanceSheet(params: {
  societyId: string;
  asOf: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const accounts = await prisma.ledgerAccount.findMany({
    where: { societyId: params.societyId, isActive: true },
  });

  const grouped = await prisma.ledgerEntry.groupBy({
    by: ["accountId"],
    where: { societyId: params.societyId, postedAt: { lte: params.asOf } },
    _sum: { debit: true, credit: true },
  });

  const sums = new Map(grouped.map((r) => [r.accountId, r._sum]));

  const mapAccounts = (types: string[]) =>
    accounts
      .filter((a) => types.includes(a.type))
      .map((a) => {
        const s = sums.get(a.id);
        const balance =
          a.type === "ASSET" || a.type === "EXPENSE"
            ? (s?.debit ?? 0) - (s?.credit ?? 0)
            : (s?.credit ?? 0) - (s?.debit ?? 0);
        return { code: a.code, name: a.name, type: a.type, balance };
      })
      .filter((r) => r.balance !== 0);

  const assets = mapAccounts(["ASSET"]);
  const liabilities = mapAccounts(["LIABILITY"]);
  const equity = mapAccounts(["EQUITY"]);

  const totalAssets = assets.reduce((s, r) => s + r.balance, 0);
  const totalLiabilities = liabilities.reduce((s, r) => s + r.balance, 0);
  const totalEquity = equity.reduce((s, r) => s + r.balance, 0);

  return {
    asOf: params.asOf,
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1,
  };
}

// ── Receipts & Payments Account ───────────────────

export async function getReceiptsPayments(params: {
  societyId: string;
  from: Date;
  to: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const bankAndCashCodes = ["1000", "1010", "1011", "1012"];

  const accounts = await prisma.ledgerAccount.findMany({
    where: { societyId: params.societyId, code: { in: bankAndCashCodes }, isActive: true },
  });
  const cashBankIds = accounts.map((a) => a.id);

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      societyId: params.societyId,
      accountId: { in: cashBankIds },
      postedAt: { gte: params.from, lte: params.to },
    },
    include: { transaction: true, account: true },
    orderBy: { postedAt: "asc" },
  });

  const receipts = entries
    .filter((e) => e.debit > 0)
    .map((e) => ({ date: e.postedAt, description: e.memo ?? e.transaction.description, amount: e.debit, account: e.account.name }));

  const payments = entries
    .filter((e) => e.credit > 0)
    .map((e) => ({ date: e.postedAt, description: e.memo ?? e.transaction.description, amount: e.credit, account: e.account.name }));

  const totalReceipts = receipts.reduce((s, r) => s + r.amount, 0);
  const totalPayments = payments.reduce((s, r) => s + r.amount, 0);

  return {
    from: params.from,
    to: params.to,
    receipts,
    payments,
    totalReceipts,
    totalPayments,
    closingBalance: totalReceipts - totalPayments,
  };
}

// ── Auto-Post Expense ─────────────────────────────

export async function autoPostExpense(params: {
  societyId: string;
  expenseId: string;
  amount: number;
  category: string;
  tdsAmount?: number;
  paidVia?: string;
  description: string;
  paidOn: Date;
  createdBy?: string;
}) {
  const expenseCode = EXPENSE_CATEGORY_TO_ACCOUNT[params.category] ?? "5021";
  const bankCode = params.paidVia === "cash" ? "1000" : "1010";
  const lines = expensePaidEntries(params.amount, expenseCode, bankCode, params.tdsAmount ?? 0);

  return postJournalVoucher({
    societyId: params.societyId,
    createdBy: params.createdBy,
    narration: `Expense: ${params.description}`,
    voucherDate: params.paidOn,
    lines,
  });
}

// ── Auto-Post Payment Received ────────────────────

export async function autoPostPaymentReceived(params: {
  societyId: string;
  amount: number;
  description: string;
  paidAt: Date;
  bankCode?: string;
  createdBy?: string;
}) {
  const lines = paymentReceivedEntries(params.amount, params.bankCode ?? "1010");
  return postJournalVoucher({
    societyId: params.societyId,
    createdBy: params.createdBy,
    narration: `Payment received: ${params.description}`,
    voucherDate: params.paidAt,
    lines,
  });
}

// ── Auto-Post Salary Paid ─────────────────────────

export async function autoPostSalaryPaid(params: {
  societyId: string;
  amount: number;
  staffName: string;
  month: string;
  paidOn: Date;
  createdBy?: string;
}) {
  const lines = salaryPaidEntries(params.amount);
  return postJournalVoucher({
    societyId: params.societyId,
    createdBy: params.createdBy,
    narration: `Salary paid: ${params.staffName} — ${params.month}`,
    voucherDate: params.paidOn,
    lines,
  });
}

// ── Monthly Depreciation Run ──────────────────────

export async function runMonthlyDepreciation(params: {
  societyId: string;
  period: string;
  createdBy?: string;
}) {
  const assets = await prisma.societyAsset.findMany({
    where: { societyId: params.societyId, isActive: true, currentValue: { gt: 0 } },
  });

  const results = [];
  for (const asset of assets) {
    const existing = await prisma.depreciationEntry.findUnique({
      where: { societyId_assetId_period: { societyId: params.societyId, assetId: asset.id, period: params.period } },
    });
    if (existing) continue;

    const openingValue = asset.currentValue ?? 0;
    if (openingValue <= 0) continue;

    const depAmount = computeMonthlyDepreciation(openingValue, asset.category);
    const closingValue = Math.max(0, openingValue - depAmount);

    const lines = depreciationEntries(depAmount);
    let jv;
    try {
      jv = await postJournalVoucher({
        societyId: params.societyId,
        createdBy: params.createdBy,
        narration: `Depreciation: ${asset.name} — ${params.period}`,
        lines,
      });
    } catch {
      continue;
    }

    const entry = await prisma.depreciationEntry.create({
      data: {
        societyId: params.societyId,
        assetId: asset.id,
        period: params.period,
        openingValue,
        depreciationRate: 0.1,
        depreciationAmount: depAmount,
        closingValue,
        journalVoucherId: jv.id,
      },
    });

    await prisma.societyAsset.update({
      where: { id: asset.id },
      data: { currentValue: closingValue },
    });

    results.push(entry);
  }

  return results;
}

// ── GST Summary ───────────────────────────────────

export async function getGSTSummary(params: {
  societyId: string;
  from: Date;
  to: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const accounts = await prisma.ledgerAccount.findMany({
    where: { societyId: params.societyId, code: { in: ["4007", "5022"] }, isActive: true },
  });

  const results: Record<string, { debit: number; credit: number }> = {};
  for (const acc of accounts) {
    const g = await prisma.ledgerEntry.aggregate({
      where: { societyId: params.societyId, accountId: acc.id, postedAt: { gte: params.from, lte: params.to } },
      _sum: { debit: true, credit: true },
    });
    results[acc.code] = { debit: g._sum.debit ?? 0, credit: g._sum.credit ?? 0 };
  }

  const outputTax = (results["4007"]?.credit ?? 0) - (results["4007"]?.debit ?? 0);
  const inputTax = (results["5022"]?.debit ?? 0) - (results["5022"]?.credit ?? 0);

  return { outputTax, inputTax, netPayable: outputTax - inputTax };
}

// ── TDS Summary ───────────────────────────────────

export async function getTDSSummary(params: {
  societyId: string;
  from: Date;
  to: Date;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const account = await prisma.ledgerAccount.findFirst({
    where: { societyId: params.societyId, code: "2200", isActive: true },
  });

  if (!account) return { tdsDeducted: 0, tdsRemitted: 0, tdsPending: 0, entries: [] };

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      societyId: params.societyId,
      accountId: account.id,
      postedAt: { gte: params.from, lte: params.to },
    },
    include: { transaction: true },
    orderBy: { postedAt: "desc" },
  });

  const tdsDeducted = entries.reduce((s, e) => s + e.credit, 0);
  const tdsRemitted = entries.reduce((s, e) => s + e.debit, 0);

  return {
    tdsDeducted,
    tdsRemitted,
    tdsPending: tdsDeducted - tdsRemitted,
    entries: entries.map((e) => ({
      date: e.postedAt,
      description: e.memo ?? e.transaction.description,
      deducted: e.credit,
      remitted: e.debit,
    })),
  };
}

// ── Year-End Closing ──────────────────────────────

export async function performYearEndClose(params: {
  societyId: string;
  fiscalYearEnd: Date;
  createdBy?: string;
}) {
  await ensureDefaultChartOfAccounts(params.societyId);

  const accounts = await prisma.ledgerAccount.findMany({
    where: { societyId: params.societyId, type: { in: ["INCOME", "EXPENSE"] }, isActive: true },
  });

  const grouped = await prisma.ledgerEntry.groupBy({
    by: ["accountId"],
    where: { societyId: params.societyId, postedAt: { lte: params.fiscalYearEnd } },
    _sum: { debit: true, credit: true },
  });

  const sums = new Map(grouped.map((r) => [r.accountId, r._sum]));
  const lines: JournalLineInput[] = [];
  let surplus = 0;

  for (const acc of accounts) {
    const s = sums.get(acc.id);
    if (!s) continue;
    const net = (s.credit ?? 0) - (s.debit ?? 0);
    if (net === 0) continue;

    if (acc.type === "INCOME") {
      lines.push({ accountCode: acc.code, debit: net, credit: 0, memo: `Close ${acc.name}` });
      surplus += net;
    } else {
      const expNet = (s.debit ?? 0) - (s.credit ?? 0);
      lines.push({ accountCode: acc.code, debit: 0, credit: expNet, memo: `Close ${acc.name}` });
      surplus -= expNet;
    }
  }

  if (lines.length === 0) throw new Error("No income/expense entries to close");

  lines.push({
    accountCode: "3003",
    debit: surplus < 0 ? Math.abs(surplus) : 0,
    credit: surplus > 0 ? surplus : 0,
    memo: `Year-end surplus / (deficit)`,
  });

  return postJournalVoucher({
    societyId: params.societyId,
    createdBy: params.createdBy,
    narration: `Year-end closing — FY ending ${params.fiscalYearEnd.toISOString().split("T")[0]}`,
    voucherDate: params.fiscalYearEnd,
    lines,
  });
}
