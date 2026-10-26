import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 safe-px py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo inverted href="/" size="md" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            L&apos;atelier numérique des artisans français — CRM, planning,
            interventions, devis et présence publique, réunis.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Produit
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/artisans" className="hover:text-white">
                Annuaire
              </Link>
            </li>
            <li>
              <Link href="/inscription" className="hover:text-white">
                Espace artisan
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="hover:text-white">
                Connexion
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Vision
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Conçu pour remplacer le bricolage Excel + WhatsApp + papier, sans
            devenir un ERP incompréhensible.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/35 safe-pb">
        © {year} Artisania. Fabriqué pour les métiers.
      </div>
    </footer>
  );
}
