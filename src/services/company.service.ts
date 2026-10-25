import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/session";
import { slugify } from "@/lib/utils";
import type {
  ArtisanProfileInput,
  CompanySettingsInput,
} from "@/lib/validations/company";

export async function getCompanyWithProfile(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
    include: {
      artisanProfiles: { take: 1, orderBy: { createdAt: "asc" } },
    },
  });
}

export async function updateCompanySettings(
  companyId: string,
  input: CompanySettingsInput,
) {
  return prisma.company.update({
    where: { id: companyId },
    data: {
      name: input.name.trim(),
      legalName: emptyToNull(input.legalName),
      siret: emptyToNull(input.siret),
      vatNumber: emptyToNull(input.vatNumber),
      email: emptyToNull(input.email),
      phone: emptyToNull(input.phone),
      website: emptyToNull(input.website),
      addressLine1: emptyToNull(input.addressLine1),
      addressLine2: emptyToNull(input.addressLine2),
      city: emptyToNull(input.city),
      postalCode: emptyToNull(input.postalCode),
      description: emptyToNull(input.description),
    },
  });
}

export async function updateArtisanProfile(
  companyId: string,
  userId: string,
  input: ArtisanProfileInput,
) {
  const existing = await prisma.artisanProfile.findFirst({
    where: { companyId, userId },
  });

  const data = {
    trade: input.trade.trim(),
    trades: [input.trade.trim()],
    bio: emptyToNull(input.bio),
    serviceArea: emptyToNull(input.serviceArea),
    city: emptyToNull(input.city),
    postalCode: emptyToNull(input.postalCode),
    yearsExperience: input.yearsExperience ?? null,
    isPublic: input.isPublic ?? true,
  };

  if (existing) {
    return prisma.artisanProfile.update({
      where: { id: existing.id },
      data,
    });
  }

  const company = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
  });
  const baseSlug = slugify(`${company.name}-${input.trade}-${input.city ?? ""}`);
  let slug = baseSlug || `artisan-${companyId.slice(-6)}`;
  const collision = await prisma.artisanProfile.findUnique({ where: { slug } });
  if (collision) slug = `${slug}-${Date.now().toString(36)}`;

  return prisma.artisanProfile.create({
    data: {
      userId,
      companyId,
      slug,
      ...data,
    },
  });
}
