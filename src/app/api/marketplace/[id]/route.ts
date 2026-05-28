import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, status, session } = await requirePermission("dashboard");
  if (error) return Response.json({ error }, { status });

  const { id } = await params;
  const body = await request.json();

  const listing = await prisma.marketplaceListing.findFirst({
    where: { id, societyId: session!.societyId },
  });

  if (!listing) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  // Only the owner or admin can update
  if (listing.userId !== session!.userId && !["chairman", "secretary"].includes(session!.role)) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  const updated = await prisma.marketplaceListing.update({
    where: { id },
    data: {
      status: body.status || listing.status,
      soldAt: body.status === "sold" ? new Date() : listing.soldAt,
      archivedAt: body.status === "archived" ? new Date() : listing.archivedAt,
      title: body.title || listing.title,
      price: body.price !== undefined ? parseFloat(body.price) : listing.price,
    },
  });

  return Response.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, status, session } = await requirePermission("dashboard");
  if (error) return Response.json({ error }, { status });

  const { id } = await params;

  const listing = await prisma.marketplaceListing.findFirst({
    where: { id, societyId: session!.societyId },
  });

  if (!listing) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.userId !== session!.userId && !["chairman", "secretary"].includes(session!.role)) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.marketplaceListing.update({
    where: { id },
    data: { status: "expired", archivedAt: new Date() },
  });
  return Response.json({ success: true });
}
