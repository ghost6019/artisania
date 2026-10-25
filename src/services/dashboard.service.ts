import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats(companyId: string) {
  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    appointmentsTodayCount,
    upcomingInterventions,
    pendingRequests,
    quotesPending,
    unpaidInvoices,
    nextInterventions,
    paidThisMonth,
    todayAgenda,
    recentRequests,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        companyId,
        startsAt: { gte: dayStart, lte: dayEnd },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
    }),
    prisma.intervention.count({
      where: {
        companyId,
        status: { in: ["PENDING", "SCHEDULED", "IN_PROGRESS"] },
        OR: [{ scheduledAt: { gte: now } }, { scheduledAt: null }],
      },
    }),
    prisma.serviceRequest.count({
      where: { companyId, status: "PENDING" },
    }),
    prisma.quote.count({
      where: { companyId, status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.invoice.count({
      where: { companyId, status: { in: ["SENT", "OVERDUE"] } },
    }),
    prisma.intervention.findMany({
      where: {
        companyId,
        status: { in: ["PENDING", "SCHEDULED", "IN_PROGRESS"] },
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
      },
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.invoice.aggregate({
      where: {
        companyId,
        status: "PAID",
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { totalCents: true },
    }),
    prisma.appointment.findMany({
      where: {
        companyId,
        startsAt: { gte: dayStart, lte: dayEnd },
        status: { not: "CANCELLED" },
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { startsAt: "asc" },
      take: 8,
    }),
    prisma.serviceRequest.findMany({
      where: { companyId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return {
    appointmentsToday: appointmentsTodayCount,
    upcomingInterventions,
    pendingRequests,
    quotesPending,
    unpaidInvoices,
    revenueMonthCents: paidThisMonth._sum.totalCents ?? 0,
    nextInterventions,
    todayAgenda,
    recentRequests,
  };
}
