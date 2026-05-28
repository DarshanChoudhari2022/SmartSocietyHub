import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["chairman", "secretary", "treasurer"];

export async function GET() {
  const session = await getSession();
  if (!session?.societyId || !ALLOWED.includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.bankAccount.findMany({
    where: { societyId: session.societyId, isActive: true },
    orderBy: { accountName: "asc" },
    include: {
      _count: { select: { statements: true } },
    },
  });

  return Response.json({ accounts });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.societyId || !["chairman", "treasurer"].includes(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { accountName, bankName, accountNumber, ifscCode, accountType, openingBalance, ledgerAccountCode } = body;

  if (!accountName || !bankName || !accountNumber) {
    return Response.json({ error: "accountName, bankName, and accountNumber are required" }, { status: 400 });
  }

  const account = await prisma.bankAccount.create({
    data: {
      societyId: session.societyId,
      accountName: String(accountName),
      bankName: String(bankName),
      accountNumber: String(accountNumber),
      ifscCode: ifscCode ? String(ifscCode) : null,
      accountType: accountType ?? "SAVINGS",
      openingBalance: Number(openingBalance ?? 0),
      ledgerAccountCode: ledgerAccountCode ?? "1010",
    },
  });

  return Response.json({ account }, { status: 201 });
}
