import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const [users, companies, profiles, pendingReviews, openReports, requests] =
    await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.artisanProfile.count({ where: { isPublic: true } }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: { in: ["OPEN", "IN_REVIEW"] } } }),
      prisma.serviceRequest.count({ where: { status: "PENDING" } }),
    ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      accountType: true,
      globalRole: true,
      createdAt: true,
    },
  });

  const recentCompanies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      name: true,
      city: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      _count: { select: { memberships: true } },
    },
  });

  return {
    stats: { users, companies, profiles, pendingReviews, openReports, requests },
    recentUsers,
    recentCompanies,
  };
}

export async function listUsersForAdmin() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      accountType: true,
      globalRole: true,
      createdAt: true,
      memberships: {
        select: {
          role: true,
          company: { select: { name: true } },
        },
      },
    },
  });
}

export async function setCompanyActive(companyId: string, isActive: boolean) {
  return prisma.company.update({
    where: { id: companyId },
    data: { isActive },
  });
}
