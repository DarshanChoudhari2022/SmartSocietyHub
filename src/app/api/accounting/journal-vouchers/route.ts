import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postJournalVoucher } from "@/domain/accounting-engine";
import { logSecurityEvent } from "@/lib/enterprise-security";

const ADMIN_ROLES = ["chairman", "treasurer"];

export async function GET() {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "secretary", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vouchers = await prisma.journalVoucher.findMany({
    where: { societyId: session.societyId },
    include: {
      lines: {
        include: { account: true },
      },
    },
    orderBy: { voucherDate: "desc" },
    take: 50,
  });

  return Response.json({ vouchers });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ADMIN_ROLES.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { voucherId, action } = body;

  if (action !== "void" || !voucherId) {
    return Response.json({ error: "Only void action is supported" }, { status: 400 });
  }

  const voucher = await prisma.journalVoucher.findFirst({
    where: { id: voucherId, societyId: session.societyId },
    include: { lines: { include: { account: true } } },
  });

  if (!voucher) {
    return Response.json({ error: "Voucher not found" }, { status: 404 });
  }
  if (voucher.status === "VOID") {
    return Response.json({ error: "Voucher is already voided" }, { status: 400 });
  }

  // Post reversing entry
  const reversingLines = voucher.lines.map((line: { account: { code: string }; debit: number; credit: number }) => ({
    accountCode: line.account.code,
    debit: line.credit,
    credit: line.debit,
    memo: `Reversal of ${voucher.voucherNumber}`,
  }));

  try {
    const reversalVoucher = await postJournalVoucher({
      societyId: session.societyId,
      createdBy: session.userId,
      narration: `VOID: Reversal of ${voucher.voucherNumber} — ${voucher.narration}`,
      lines: reversingLines,
    });

    await prisma.journalVoucher.update({
      where: { id: voucherId },
      data: { status: "VOID", voidedAt: new Date() },
    });

    return Response.json({ reversalVoucher, message: `${voucher.voucherNumber} voided with reversal ${reversalVoucher.voucherNumber}` });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to void voucher" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ADMIN_ROLES.includes(session.role)) {
    await logSecurityEvent({
      societyId: session?.societyId,
      userId: session?.userId,
      eventType: "access_denied",
      severity: "warning",
      path: "/api/accounting/journal-vouchers",
    });
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const narration = String(body.narration || "").trim();
    const lines = Array.isArray(body.lines) ? body.lines : [];

    if (!narration) {
      return Response.json({ error: "Narration is required" }, { status: 400 });
    }

    const voucher = await postJournalVoucher({
      societyId: session.societyId,
      createdBy: session.userId,
      narration,
      voucherDate: body.voucherDate ? new Date(body.voucherDate) : new Date(),
      lines,
    });

    return Response.json({ voucher }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to post journal voucher" },
      { status: 400 }
    );
  }
}
