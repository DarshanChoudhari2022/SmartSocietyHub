import { getSession } from "@/lib/auth";
import { performYearEndClose } from "@/domain/accounting-engine";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Only chairman or treasurer can perform year-end closing" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.fiscalYearEnd) {
    return Response.json({ error: "fiscalYearEnd date is required" }, { status: 400 });
  }

  try {
    const voucher = await performYearEndClose({
      societyId: session.societyId,
      fiscalYearEnd: new Date(body.fiscalYearEnd),
      createdBy: session.userId,
    });

    return Response.json({ voucher, message: "Year-end closing completed successfully" });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Year-end close failed" },
      { status: 400 }
    );
  }
}
