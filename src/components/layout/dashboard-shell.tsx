"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";

type DashboardShellProps = {
  children: React.ReactNode;
  userName: string;
  companyName?: string | null;
};

export function DashboardShell({
  children,
  userName,
  companyName,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const firstName = userName.split(" ")[0] || userName;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar
        companyName={companyName}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[calc(4.25rem+env(safe-area-inset-top))] items-center justify-between border-b border-line bg-surface/90 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                Bonjour, {firstName}
              </p>
              <p className="truncate text-xs capitalize text-steel">
                {new Intl.DateTimeFormat("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date())}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-11 w-11 sm:hidden"
              aria-label="Site public"
            >
              <Link href="/artisans">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/artisans">
                <ExternalLink className="h-3.5 w-3.5" />
                Site public
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-7 lg:px-8 safe-pb">
          {children}
        </main>
      </div>
    </div>
  );
}
