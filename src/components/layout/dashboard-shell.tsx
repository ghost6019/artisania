"use client";

import { useState } from "react";
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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        companyName={companyName}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[4.25rem] items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-medium text-ink">
                Bonjour, {userName.split(" ")[0]}
              </p>
              <p className="text-xs text-steel">
                {new Intl.DateTimeFormat("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/artisans">
                <ExternalLink className="h-3.5 w-3.5" />
                Site public
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
