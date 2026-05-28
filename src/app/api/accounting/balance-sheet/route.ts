import { getSession } from "@/lib/auth";
import { getBalanceSheet } from "@/domain/accounting-engine";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();

  const report = await getBalanceSheet({
    societyId: session.societyId,
    asOf: new Date(asOf),
  });

  return Response.json({ report });
}
