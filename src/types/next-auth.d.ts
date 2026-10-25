import { AccountType, GlobalRole, MembershipRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type SessionMembership = {
  id: string;
  companyId: string;
  role: MembershipRole;
  companyName: string;
  isDefault: boolean;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      globalRole: GlobalRole;
      accountType: AccountType;
      memberships: SessionMembership[];
      activeCompanyId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    globalRole: GlobalRole;
    accountType: AccountType;
    memberships: SessionMembership[];
    activeCompanyId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    globalRole: GlobalRole;
    accountType: AccountType;
    memberships: SessionMembership[];
    activeCompanyId: string | null;
  }
}
