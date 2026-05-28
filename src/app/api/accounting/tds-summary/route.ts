import { getSession } from "@/lib/auth";
import { getTDSSummary, postJournalVoucher } from "@/domain/accounting-engine";
import { tdsRemittanceEntries } from "@/domain/accounting";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const from = url.searchParams.get("from") ?? new Date(new Date().getFullYear(), 3, 1).toISOString();
  const to = url.searchParams.get("to") ?? new Date().toISOString();

  const [summary, challans] = await Promise.all([
    getTDSSummary({ societyId: session.societyId, from: new Date(from), to: new Date(to) }),
    prisma.tDSChallan.findMany({
      where: { societyId: session.societyId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return Response.json({ summary, challans });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { quarter, challanNumber, bsrCode, paymentDate, amount, section, vendorPAN, vendorName, notes } = body;

  if (!quarter || !amount) {
    return Response.json({ error: "quarter and amount are required" }, { status: 400 });
  }

  const challan = await prisma.tDSChallan.create({
    data: {
      societyId: session.societyId,
      quarter: String(quarter),
      challanNumber: challanNumber ?? null,
      bsrCode: bsrCode ?? null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      amount: Number(amount),
      totalAmount: Number(amount),
      section: section ?? "194C",
      vendorPAN: vendorPAN ?? null,
      vendorName: vendorName ?? null,
      notes: notes ?? null,
      status: paymentDate ? "PAID" : "PENDING",
      createdBy: session.userId,
    },
  });

  // If challan is paid, post TDS remittance journal entry (Dr TDS Payable, Cr Bank)
  if (paymentDate && Number(amount) > 0) {
    try {
      const lines = tdsRemittanceEntries(Number(amount));
      await postJournalVoucher({
        societyId: session.societyId,
        createdBy: session.userId,
        narration: `TDS remittance — ${quarter} — ${vendorName ?? ""}`.trim(),
        voucherDate: new Date(paymentDate),
        lines,
      });
    } catch {
      // Ledger posting failed — challan is still saved
    }
  }

  return Response.json({ challan }, { status: 201 });
}
