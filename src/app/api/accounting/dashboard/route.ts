import { getSession } from "@/lib/auth";
import { getIncomeExpenditure, getGSTSummary, getTDSSummary, ensureDefaultChartOfAccounts } from "@/domain/accounting-engine";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET() {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 3, 1); // Indian FY Apr 1
  if (yearStart > now) yearStart.setFullYear(now.getFullYear() - 1);

  const [ieMonth, ieYTD, gstYTD, tdsYTD, accounts] = await Promise.all([
    getIncomeExpenditure({ societyId: session.societyId, from: monthStart, to: now }),
    getIncomeExpenditure({ societyId: session.societyId, from: yearStart, to: now }),
    getGSTSummary({ societyId: session.societyId, from: yearStart, to: now }),
    getTDSSummary({ societyId: session.societyId, from: yearStart, to: now }),
    ensureDefaultChartOfAccounts(session.societyId),
  ]);

  const receivableAccount = accounts.find((a: { code: string }) => a.code === "1100");
  let outstandingReceivables = 0;
  if (receivableAccount) {
    const agg = await prisma.ledgerEntry.aggregate({
      where: { societyId: session.societyId, accountId: (receivableAccount as { id: string }).id },
      _sum: { debit: true, credit: true },
    });
    outstandingReceivables = (agg._sum.debit ?? 0) - (agg._sum.credit ?? 0);
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { societyId: session.societyId, isActive: true },
  });

  const budgets = await prisma.budget.findMany({
    where: { societyId: session.societyId, fiscalYear: `${yearStart.getFullYear()}-${String(yearStart.getFullYear() + 1).slice(2)}` },
  });
  const totalBudgeted = budgets.reduce((s: number, b: { planned: number }) => s + b.planned, 0);
  const totalActual = budgets.reduce((s: number, b: { actual: number }) => s + b.actual, 0);

  return Response.json({
    kpis: {
      collectionsThisMonth: ieMonth.totalIncome,
      collectionsYTD: ieYTD.totalIncome,
      expensesThisMonth: ieMonth.totalExpense,
      expensesYTD: ieYTD.totalExpense,
      surplusYTD: ieYTD.surplus,
      outstandingReceivables,
      gstPayable: gstYTD.netPayable,
      tdsPending: tdsYTD.tdsPending,
      budgetUtilization: totalBudgeted > 0 ? Math.round((totalActual / totalBudgeted) * 100) : 0,
      bankAccounts: bankAccounts.length,
    },
    recentIncome: ieMonth.income,
    recentExpenses: ieMonth.expenses,
  });
}
