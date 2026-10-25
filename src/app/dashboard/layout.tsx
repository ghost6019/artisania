import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/dashboard");

  const membership = session.user.memberships.find(
    (m) => m.companyId === session.user.activeCompanyId,
  );

  return (
    <DashboardShell
      userName={session.user.name ?? "Utilisateur"}
      companyName={membership?.companyName}
    >
      {children}
    </DashboardShell>
  );
}
