import bcrypt from "bcryptjs";
import { AccountType, MembershipRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { RegisterInput } from "@/lib/validations/auth";

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const accountType: AccountType =
    input.accountType === "ARTISAN" ? "ARTISAN" : "INDIVIDUAL";

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone?.trim() || null,
        accountType,
      },
    });

    if (accountType === "ARTISAN") {
      const companyName = input.companyName!.trim();
      const trade = input.trade!.trim();
      const city = input.city?.trim() || null;

      const company = await tx.company.create({
        data: {
          name: companyName,
          email,
          phone: input.phone?.trim() || null,
          city,
          description: null,
        },
      });

      await tx.companyMembership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: MembershipRole.OWNER,
          isDefault: true,
        },
      });

      const baseSlug = slugify(`${companyName}-${trade}-${city ?? "france"}`);
      let slug = baseSlug || `artisan-${user.id.slice(-6)}`;
      const collision = await tx.artisanProfile.findUnique({ where: { slug } });
      if (collision) {
        slug = `${slug}-${user.id.slice(-4)}`;
      }

      await tx.artisanProfile.create({
        data: {
          userId: user.id,
          companyId: company.id,
          slug,
          trade,
          trades: [trade],
          city,
          isPublic: true,
        },
      });
    }

    return user;
  });
}
