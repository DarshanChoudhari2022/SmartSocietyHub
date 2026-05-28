import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["chairman", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "secretary", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const bankAccountId = url.searchParams.get("bankAccountId");

  const reconciliations = await prisma.bankReconciliation.findMany({
    where: {
      societyId: session.societyId,
      ...(bankAccountId ? { bankAccountId } : {}),
    },
    include: { bankAccount: true },
    orderBy: { period: "desc" },
    take: 24,
  });

  const statements = bankAccountId
    ? await prisma.bankStatement.findMany({
        where: { societyId: session.societyId, bankAccountId },
        orderBy: { transactionDate: "desc" },
        take: 100,
      })
    : [];

  return Response.json({ reconciliations, statements });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "add_statement") {
    const { bankAccountId, transactions } = body;
    if (!bankAccountId || !Array.isArray(transactions)) {
      return Response.json({ error: "bankAccountId and transactions[] are required" }, { status: 400 });
    }

    const created = await prisma.bankStatement.createMany({
      data: transactions.map((t: { transactionDate: string; description: string; debit?: number; credit?: number; balance?: number; reference?: string }) => ({
        societyId: session.societyId,
        bankAccountId,
        transactionDate: new Date(t.transactionDate),
        description: String(t.description),
        debit: Number(t.debit ?? 0),
        credit: Number(t.credit ?? 0),
        balance: t.balance != null ? Number(t.balance) : null,
        reference: t.reference ?? null,
      })),
      skipDuplicates: true,
    });

    return Response.json({ created: created.count }, { status: 201 });
  }

  if (action === "reconcile_period") {
    const { bankAccountId, period, statementBalance, notes } = body;
    if (!bankAccountId || !period) {
      return Response.json({ error: "bankAccountId and period are required" }, { status: 400 });
    }

    const [startY, startM] = period.split("-").map(Number);
    const from = new Date(startY, startM - 1, 1);
    const to = new Date(startY, startM, 0, 23, 59, 59);

    const bankAccount = await prisma.bankAccount.findFirst({
      where: { societyId: session.societyId, id: bankAccountId },
    });
    if (!bankAccount) return Response.json({ error: "Bank account not found" }, { status: 404 });

    const ledgerAccount = await prisma.ledgerAccount.findFirst({
      where: { societyId: session.societyId, code: bankAccount.ledgerAccountCode },
    });

    let ledgerBalance = bankAccount.openingBalance;
    if (ledgerAccount) {
      const agg = await prisma.ledgerEntry.aggregate({
        where: { societyId: session.societyId, accountId: ledgerAccount.id, postedAt: { lte: to } },
        _sum: { debit: true, credit: true },
      });
      ledgerBalance += (agg._sum.debit ?? 0) - (agg._sum.credit ?? 0);
    }

    const reconciledItems = await prisma.bankStatement.count({
      where: { societyId: session.societyId, bankAccountId, reconciled: true, transactionDate: { gte: from, lte: to } },
    });
    const unreconciledItems = await prisma.bankStatement.count({
      where: { societyId: session.societyId, bankAccountId, reconciled: false, transactionDate: { gte: from, lte: to } },
    });

    const sbBalance = Number(statementBalance ?? 0);

    const recon = await prisma.bankReconciliation.upsert({
      where: { societyId_bankAccountId_period: { societyId: session.societyId, bankAccountId, period } },
      create: {
        societyId: session.societyId,
        bankAccountId,
        period,
        statementBalance: sbBalance,
        ledgerBalance,
        difference: sbBalance - ledgerBalance,
        reconciledItems,
        unreconciledItems,
        status: unreconciledItems === 0 ? "RECONCILED" : "DRAFT",
        notes: notes ?? null,
        createdBy: session.userId,
        reconciledAt: unreconciledItems === 0 ? new Date() : null,
      },
      update: {
        statementBalance: sbBalance,
        ledgerBalance,
        difference: sbBalance - ledgerBalance,
        reconciledItems,
        unreconciledItems,
        status: unreconciledItems === 0 ? "RECONCILED" : "DRAFT",
        notes: notes ?? null,
        reconciledAt: unreconciledItems === 0 ? new Date() : null,
      },
    });

    return Response.json({ reconciliation: recon });
  }

  if (action === "mark_reconciled") {
    const { statementIds } = body;
    if (!Array.isArray(statementIds)) {
      return Response.json({ error: "statementIds[] required" }, { status: 400 });
    }
    await prisma.bankStatement.updateMany({
      where: { id: { in: statementIds }, societyId: session.societyId },
      data: { reconciled: true, reconciledAt: new Date() },
    });
    return Response.json({ updated: statementIds.length });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
