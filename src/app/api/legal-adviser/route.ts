import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.societyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const society = await prisma.society.findUnique({
    where: { id: session.societyId },
    select: {
      legalAdviserName: true,
      legalAdviserPhone: true,
    },
  });

  return Response.json({
    legalAdviser: {
      name: society?.legalAdviserName || "Legal Adviser",
      phone: society?.legalAdviserPhone || null,
    },
  });
}
