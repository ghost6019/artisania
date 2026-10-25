import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { SessionMembership } from "@/types/next-auth";
import { authConfig } from "@/lib/auth.config";
import { ensureAuthUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

ensureAuthUrl();

async function loadMemberships(userId: string): Promise<SessionMembership[]> {
  const memberships = await prisma.companyMembership.findMany({
    where: { userId },
    include: { company: { select: { id: true, name: true } } },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return memberships.map((m) => ({
    id: m.id,
    companyId: m.companyId,
    role: m.role,
    companyName: m.company.name,
    isDefault: m.isDefault,
  }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        const memberships = await loadMemberships(user.id);
        const activeCompanyId =
          memberships.find((m) => m.isDefault)?.companyId ??
          memberships[0]?.companyId ??
          null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          globalRole: user.globalRole,
          accountType: user.accountType,
          memberships,
          activeCompanyId,
        };
      },
    }),
  ],
});
