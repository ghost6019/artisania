import { prisma } from "@/lib/prisma";

export type ArtisanSearchParams = {
  q?: string;
  trade?: string;
  city?: string;
};

export async function searchArtisans(params: ArtisanSearchParams) {
  const { q, trade, city } = params;

  return prisma.artisanProfile.findMany({
    where: {
      isPublic: true,
      company: { isActive: true },
      ...(trade ? { trade: { equals: trade, mode: "insensitive" } } : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { trade: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
              { company: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      company: {
        select: {
          name: true,
          city: true,
          description: true,
          isVerified: true,
        },
      },
      user: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { ratingAvg: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
}

export async function getPublicArtisanBySlug(slug: string) {
  return prisma.artisanProfile.findFirst({
    where: { slug, isPublic: true, company: { isActive: true } },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          city: true,
          postalCode: true,
          description: true,
          phone: true,
          email: true,
          website: true,
          isVerified: true,
        },
      },
      user: {
        select: { firstName: true, lastName: true },
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          authorName: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function listTrades() {
  const rows = await prisma.artisanProfile.findMany({
    where: { isPublic: true },
    select: { trade: true },
    distinct: ["trade"],
    orderBy: { trade: "asc" },
  });
  return rows.map((r) => r.trade);
}
