import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/session";
import type { ServiceRequestInput } from "@/lib/validations/service-request";

export async function createServiceRequest(
  input: ServiceRequestInput,
  authorId?: string | null,
) {
  let companyId = input.companyId ?? null;
  const artisanProfileId = input.artisanProfileId ?? null;

  if (artisanProfileId) {
    const profile = await prisma.artisanProfile.findFirst({
      where: { id: artisanProfileId, isPublic: true },
    });
    if (!profile) throw new Error("NOT_FOUND");
    companyId = profile.companyId;
  }

  return prisma.serviceRequest.create({
    data: {
      title: input.title.trim(),
      description: input.description.trim(),
      trade: emptyToNull(input.trade),
      city: emptyToNull(input.city),
      postalCode: emptyToNull(input.postalCode),
      phone: emptyToNull(input.phone),
      email: emptyToNull(input.email),
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      artisanProfileId,
      companyId,
      authorId: authorId ?? null,
      status: "PENDING",
    },
  });
}

export async function listCompanyServiceRequests(companyId: string) {
  return prisma.serviceRequest.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAuthorServiceRequests(authorId: string) {
  return prisma.serviceRequest.findMany({
    where: { authorId },
    include: {
      artisanProfile: { select: { slug: true, trade: true } },
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
