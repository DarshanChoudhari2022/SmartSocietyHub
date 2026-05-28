import { getSession } from "@/lib/auth";
import { getGSTSummary } from "@/domain/accounting-engine";
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

  const [summary, returns] = await Promise.all([
    getGSTSummary({ societyId: session.societyId, from: new Date(from), to: new Date(to) }),
    prisma.gSTReturn.findMany({
      where: { societyId: session.societyId },
      orderBy: { period: "desc" },
      take: 24,
    }),
  ]);

  return Response.json({ summary, returns });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { period, gstNumber, outputTax, inputTax, lateFee, notes } = body;

  if (!period) {
    return Response.json({ error: "period is required" }, { status: 400 });
  }

  const net = Number(outputTax ?? 0) - Number(inputTax ?? 0);
  const total = net + Number(lateFee ?? 0);

  const gstReturn = await prisma.gSTReturn.upsert({
    where: { societyId_period: { societyId: session.societyId, period: String(period) } },
    create: {
      societyId: session.societyId,
      period: String(period),
      gstNumber: gstNumber ?? null,
      outputTax: Number(outputTax ?? 0),
      inputTax: Number(inputTax ?? 0),
      netTax: net,
      lateFee: Number(lateFee ?? 0),
      totalPayable: total,
      notes: notes ?? null,
      createdBy: session.userId,
    },
    update: {
      gstNumber: gstNumber ?? null,
      outputTax: Number(outputTax ?? 0),
      inputTax: Number(inputTax ?? 0),
      netTax: net,
      lateFee: Number(lateFee ?? 0),
      totalPayable: total,
      notes: notes ?? null,
    },
  });

  return Response.json({ gstReturn }, { status: 201 });
}
