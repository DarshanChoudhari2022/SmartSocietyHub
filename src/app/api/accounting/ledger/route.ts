import { getSession } from "@/lib/auth";
import { getAccountLedger, ensureDefaultChartOfAccounts } from "@/domain/accounting-engine";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const accountCode = url.searchParams.get("accountCode");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!accountCode) {
    const accounts = await ensureDefaultChartOfAccounts(session.societyId);
    return Response.json({ accounts });
  }

  const ledger = await getAccountLedger({
    societyId: session.societyId,
    accountCode,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  return Response.json({ ledger });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "auto_post_expense") {
    const { autoPostExpense } = await import("@/domain/accounting-engine");
    const voucher = await autoPostExpense({
      societyId: session.societyId,
      expenseId: body.expenseId,
      amount: Number(body.amount),
      category: body.category ?? "other",
      tdsAmount: body.tdsAmount ? Number(body.tdsAmount) : 0,
      paidVia: body.paidVia ?? "bank",
      description: body.description,
      paidOn: new Date(body.paidOn),
      createdBy: session.userId,
    });
    return Response.json({ voucher });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
