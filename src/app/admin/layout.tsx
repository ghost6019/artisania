import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/admin");
  if (session.user.globalRole !== "PLATFORM_ADMIN") redirect("/");

  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Artisania";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-semibold text-navy-900">
              {appName} Admin
            </Link>
            <nav className="hidden gap-4 text-sm text-slate-600 sm:flex">
              <Link href="/admin" className="hover:text-navy-900">
                Vue générale
              </Link>
              <Link href="/admin/utilisateurs" className="hover:text-navy-900">
                Utilisateurs
              </Link>
            </nav>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Site public</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
