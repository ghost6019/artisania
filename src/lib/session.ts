import { MembershipRole } from "@prisma/client";
import { auth } from "@/lib/auth";

const COMPANY_WRITE_ROLES: MembershipRole[] = [
  "OWNER",
  "ADMIN",
  "INDEPENDENT",
  "EMPLOYEE",
];

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requirePlatformAdmin() {
  const session = await requireSession();
  if (session.user.globalRole !== "PLATFORM_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function requireCompanyAccess(companyId?: string | null) {
  const session = await requireSession();
  const activeId = companyId ?? session.user.activeCompanyId;

  if (!activeId) {
    throw new Error("FORBIDDEN");
  }

  const membership = session.user.memberships.find((m) => m.companyId === activeId);
  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  return { session, companyId: activeId, membership };
}

export async function requireCompanyWrite(companyId?: string | null) {
  const ctx = await requireCompanyAccess(companyId);
  if (!COMPANY_WRITE_ROLES.includes(ctx.membership.role)) {
    throw new Error("FORBIDDEN");
  }
  return ctx;
}

export function emptyToNull(value?: string | null) {
  if (value === undefined || value === null || value.trim() === "") return null;
  return value.trim();
}
