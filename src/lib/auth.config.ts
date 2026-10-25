import type { AccountType, GlobalRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import type { SessionMembership } from "@/types/next-auth";

/**
 * Config Edge-compatible (sans Prisma) pour le middleware.
 * La logique Credentials + adapter est dans auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  providers: [],
  callbacks: {
    authorized() {
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.globalRole = user.globalRole;
        token.accountType = user.accountType;
        token.memberships = user.memberships;
        token.activeCompanyId = user.activeCompanyId;
      }

      if (trigger === "update" && session?.activeCompanyId) {
        const memberships = (token.memberships ?? []) as SessionMembership[];
        const allowed = memberships.some(
          (m) => m.companyId === session.activeCompanyId,
        );
        if (allowed) {
          token.activeCompanyId = session.activeCompanyId as string;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.globalRole = token.globalRole as GlobalRole;
        session.user.accountType = token.accountType as AccountType;
        session.user.memberships =
          (token.memberships as SessionMembership[] | undefined) ?? [];
        session.user.activeCompanyId =
          (token.activeCompanyId as string | null | undefined) ?? null;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
