"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Pilotage", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/interventions", label: "Interventions", icon: Wrench },
  { href: "/dashboard/demandes", label: "Demandes", icon: ClipboardList },
  { href: "/dashboard/devis", label: "Devis", icon: FileText },
  { href: "/dashboard/factures", label: "Factures", icon: Receipt },
  { href: "/dashboard/parametres", label: "Atelier", icon: Settings },
];

type DashboardSidebarProps = {
  companyName?: string | null;
  open?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({
  companyName,
  open = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex h-[4.25rem] items-center justify-between border-b border-white/10 px-5">
        <div className="min-w-0">
          <Logo inverted href="/" />
          {companyName ? (
            <p className="mt-1 truncate text-[11px] text-white/45">{companyName}</p>
          ) : null}
        </div>
        {onClose ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
          Navigation
        </p>
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-white"
                  : "text-white/65 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-[11px] leading-relaxed text-white/40">
          Artisania — OS métier pour artisans.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[15.5rem] shrink-0 lg:block">{content}</aside>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            aria-label="Fermer le menu"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] pt-[env(safe-area-inset-top)] shadow-2xl safe-pb">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
