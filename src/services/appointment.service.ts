import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/session";
import type { AppointmentInput } from "@/lib/validations/appointment";

export async function listAppointments(
  companyId: string,
  range?: { from?: Date; to?: Date },
) {
  return prisma.appointment.findMany({
    where: {
      companyId,
      ...(range?.from || range?.to
        ? {
            startsAt: {
              ...(range.from ? { gte: range.from } : {}),
              ...(range.to ? { lte: range.to } : {}),
            },
          }
        : {}),
    },
    include: {
      customer: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { startsAt: "asc" },
  });
}

export async function createAppointment(companyId: string, input: AppointmentInput) {
  if (input.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: input.customerId, companyId },
    });
    if (!customer) throw new Error("NOT_FOUND");
  }

  return prisma.appointment.create({
    data: {
      companyId,
      title: input.title.trim(),
      description: emptyToNull(input.description),
      customerId: input.customerId || null,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      location: emptyToNull(input.location),
      status: input.status ?? "SCHEDULED",
    },
    include: {
      customer: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export async function updateAppointment(
  companyId: string,
  id: string,
  input: AppointmentInput,
) {
  const existing = await prisma.appointment.findFirst({ where: { id, companyId } });
  if (!existing) return null;

  if (input.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: input.customerId, companyId },
    });
    if (!customer) throw new Error("NOT_FOUND");
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      title: input.title.trim(),
      description: emptyToNull(input.description),
      customerId: input.customerId || null,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      location: emptyToNull(input.location),
      status: input.status ?? existing.status,
    },
    include: {
      customer: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export async function deleteAppointment(companyId: string, id: string) {
  const existing = await prisma.appointment.findFirst({ where: { id, companyId } });
  if (!existing) return false;
  await prisma.appointment.delete({ where: { id } });
  return true;
}
