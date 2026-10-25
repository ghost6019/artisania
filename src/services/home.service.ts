import { prisma } from "@/lib/prisma";

export async function getHomeStats() {
  const [artisans, trades, companies] = await Promise.all([
    prisma.artisanProfile.count({ where: { isPublic: true } }),
    prisma.artisanProfile.findMany({
      where: { isPublic: true },
      select: { trade: true },
      distinct: ["trade"],
    }),
    prisma.company.count({ where: { isActive: true } }),
  ]);

  return {
    artisans,
    trades: trades.length,
    companies,
  };
}
