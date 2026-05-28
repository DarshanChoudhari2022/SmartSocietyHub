import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { getOccupancyContext } from "@/domain/community";

export async function GET() {
  const { error, status, session } = await requirePermission("dashboard");
  if (error) return Response.json({ error }, { status });
  if (!session?.societyId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const marketplace = await prisma.marketplaceListing.findMany({
    where: { societyId: session!.societyId, status: "active", archivedAt: null, moderationStatus: "approved" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json(marketplace);
}

export async function POST(request: Request) {
  const { error, status, session } = await requirePermission("dashboard");
  if (error) return Response.json({ error }, { status });
  if (!session?.societyId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, description, price, category, condition, contactPhone, flatNumber, imageUrls } = body;

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const context = await getOccupancyContext(session);
  const images = Array.isArray(imageUrls) ? imageUrls : [];

  const listing = await prisma.$transaction(async (tx) => {
    const created = await tx.marketplaceListing.create({
      data: {
        societyId: session!.societyId,
        userId: session!.userId,
        personId: context?.person?.id || null,
        unitOccupancyId: context?.occupancy?.id || null,
        title,
        description: description || null,
        price: price ? parseFloat(price) : null,
        category: category || "general",
        condition: condition || "good",
        contactPhone: contactPhone || null,
        flatNumber: context?.flat?.flatNumber || flatNumber || null,
        imageUrls: images.length ? JSON.stringify(images) : null,
      },
    });

    if (images.length) {
      await tx.marketplaceImage.createMany({
        data: images.map((url: string, index: number) => ({
          societyId: session.societyId,
          listingId: created.id,
          url,
          sortOrder: index,
        })),
      });
    }

    return created;
  });

  return Response.json(listing, { status: 201 });
}
