import { getSession } from "@/lib/auth";
import { runMonthlyDepreciation } from "@/domain/accounting-engine";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["chairman", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "secretary", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const period = url.searchParams.get("period");

  const entries = await prisma.depreciationEntry.findMany({
    where: {
      societyId: session.societyId,
      ...(period ? { period } : {}),
    },
    orderBy: [{ period: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  const assets = await prisma.societyAsset.findMany({
    where: { societyId: session.societyId, isActive: true },
    orderBy: { name: "asc" },
  });

  return Response.json({ entries, assets });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const period = body.period ?? new Date().toISOString().slice(0, 7);

  const results = await runMonthlyDepreciation({
    societyId: session.societyId,
    period,
    createdBy: session.userId,
  });

  return Response.json({ processed: results.length, period });
}
