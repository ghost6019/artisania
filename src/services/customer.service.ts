import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/session";
import type { CustomerInput } from "@/lib/validations/customer";

function mapCustomerData(input: CustomerInput) {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: emptyToNull(input.email),
    phone: emptyToNull(input.phone),
    addressLine1: emptyToNull(input.addressLine1),
    addressLine2: emptyToNull(input.addressLine2),
    city: emptyToNull(input.city),
    postalCode: emptyToNull(input.postalCode),
    notes: emptyToNull(input.notes),
    isProspect: input.isProspect ?? false,
  };
}

export async function listCustomers(companyId: string, search?: string) {
  return prisma.customer.findMany({
    where: {
      companyId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

export async function getCustomer(companyId: string, id: string) {
  return prisma.customer.findFirst({ where: { id, companyId } });
}

export async function createCustomer(
  companyId: string,
  ownerUserId: string,
  input: CustomerInput,
) {
  return prisma.customer.create({
    data: {
      companyId,
      ownerUserId,
      ...mapCustomerData(input),
    },
  });
}

export async function updateCustomer(
  companyId: string,
  id: string,
  input: CustomerInput,
) {
  const existing = await getCustomer(companyId, id);
  if (!existing) return null;

  return prisma.customer.update({
    where: { id },
    data: mapCustomerData(input),
  });
}

export async function deleteCustomer(companyId: string, id: string) {
  const existing = await getCustomer(companyId, id);
  if (!existing) return false;

  await prisma.customer.delete({ where: { id } });
  return true;
}
