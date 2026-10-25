import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";

export async function PublicHeader() {
  const session = await auth();

  return (
    <SiteHeader
      isLoggedIn={!!session?.user}
      isAdmin={session?.user?.globalRole === "PLATFORM_ADMIN"}
      hasCompany={!!session?.user?.activeCompanyId}
    />
  );
}
