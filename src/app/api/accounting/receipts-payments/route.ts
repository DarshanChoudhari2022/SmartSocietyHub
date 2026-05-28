import { getSession } from "@/lib/auth";
import { getReceiptsPayments } from "@/domain/accounting-engine";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return Response.json({ error: "from and to query params are required" }, { status: 400 });
  }

  const report = await getReceiptsPayments({
    societyId: session.societyId,
    from: new Date(from),
    to: new Date(to),
  });

  return Response.json({ report });
}
