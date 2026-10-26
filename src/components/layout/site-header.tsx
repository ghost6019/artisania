"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasCompany: boolean;
};

const NAV = [
  { href: "/artisans", label: "Annuaire" },
  { href: "/#methode", label: "La méthode" },
  { href: "/#produit", label: "Le produit" },
  { href: "/inscription", label: "Espace artisan" },
];

export function SiteHeader({ isLoggedIn, isAdmin, hasCompany }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !isHome || scrolled || menuOpen;

  const authActions = isLoggedIn ? (
    <>
      {isAdmin ? (
        <Button asChild variant="secondary" className="w-full md:w-auto" size="sm">
          <Link href="/admin">Admin</Link>
        </Button>
      ) : null}
      {hasCompany ? (
        <Button asChild variant="accent" className="w-full md:w-auto" size="sm">
          <Link href="/dashboard">Ouvrir l&apos;atelier</Link>
        </Button>
      ) : (
        <Button asChild variant="secondary" className="w-full md:w-auto" size="sm">
          <Link href="/compte">Mon espace</Link>
        </Button>
      )}
    </>
  ) : (
    <>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-full text-white hover:bg-white/10 hover:text-white md:w-auto"
      >
        <Link href="/connexion">Connexion</Link>
      </Button>
      <Button asChild variant="accent" className="w-full md:w-auto" size="sm">
        <Link href="/inscription">Démarrer</Link>
      </Button>
    </>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 safe-pt transition-[background-color,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl"
          : "border-b border-transparent bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between safe-px sm:h-[4.5rem] sm:px-6">
        <div className="flex min-w-0 items-center gap-10">
          <Logo inverted className="shrink-0" />
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-white/65 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal-300 transition-[width] duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">{authActions}</div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-white hover:bg-white/10 hover:text-white md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <div className="flex max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] flex-col border-t border-white/10 bg-ink md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-y-auto safe-px py-2 safe-pb">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 text-[1.05rem] text-white/85 active:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <div
              className="mt-5 flex flex-col gap-2.5 pb-4"
              onClick={() => setMenuOpen(false)}
            >
              {authActions}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
