export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { TradesMarquee } from "@/components/marketing/trades-marquee";
import { getHomeStats } from "@/services/home.service";

export default async function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Artisania";
  const stats = await getHomeStats();

  return (
    <div data-fullbleed-hero>
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white atelier-grain sm:min-h-[min(100svh,940px)]">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/40 sm:to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/55" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[min(100svh,940px)] sm:px-6 sm:pb-20 lg:pb-24">
          <div className="animate-rise flex items-center gap-3">
            <LogoMark inverted size="lg" />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                {appName}
                <span className="text-teal-300">.</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/75 sm:text-[11px]">
                Atelier numérique
              </p>
            </div>
          </div>

          <h1 className="animate-rise-delay-1 mt-6 max-w-[14ch] font-display text-[2.35rem] font-semibold leading-[0.98] tracking-tight sm:mt-8 sm:max-w-[16ch] sm:text-5xl lg:text-[4.5rem]">
            L&apos;outil qui fait tenir
            <span className="block text-teal-200">l&apos;atelier et le chantier.</span>
          </h1>

          <p className="animate-rise-delay-2 mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/68 sm:mt-6 sm:text-lg">
            Clients, agenda, interventions, devis, factures — et une présence
            publique pour être trouvé. Conçu pour les métiers manuels en France.
          </p>

          <div className="animate-rise-delay-2 mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
              <Link href="/inscription">
                Ouvrir mon atelier
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-white/5 text-white hover:border-white/45 hover:bg-white/10 sm:w-auto"
            >
              <Link href="/artisans">Trouver un artisan</Link>
            </Button>
          </div>

          <div className="animate-rise-delay-2 mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-xs text-white/55 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:pt-6 sm:text-sm">
            <p>
              <span className="block font-display text-lg font-semibold text-white sm:inline sm:text-xl">
                {stats.artisans || "—"}
              </span>{" "}
              <span className="sm:inline">profils</span>
            </p>
            <p>
              <span className="block font-display text-lg font-semibold text-white sm:inline sm:text-xl">
                {stats.trades || "—"}
              </span>{" "}
              métiers
            </p>
            <p>
              <span className="block font-display text-lg font-semibold text-white sm:inline sm:text-xl">
                {stats.companies || "—"}
              </span>{" "}
              entreprises
            </p>
          </div>
        </div>
      </section>

      <TradesMarquee />

      {/* Promesse */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Pourquoi Artisania
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight text-ink sm:text-4xl">
              Moins de chaos.
              <br />
              Plus de chantiers maîtrisés.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-steel sm:mt-5 sm:text-base">
              WhatsApp, Excel, carnets, mails — l&apos;activité se perd dans les
              outils. Artisania recentre tout sur un fil métier clair, sans
              devenir un ERP illisible.
            </p>
            <ul className="mt-6 space-y-3 sm:mt-8">
              {[
                "Demandes clients centralisées",
                "Agenda et interventions liés",
                "Devis & factures sur le même dossier",
                "Profil public pour être trouvé localement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-surface-muted shadow-[0_30px_60px_-30px_rgba(7,21,37,0.45)] sm:rounded-[1.35rem]">
              <div className="relative aspect-[4/5] w-full sm:aspect-[5/4]">
                <Image
                  src="/images/atelier.jpg"
                  alt="Artisan au travail sur un chantier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority={false}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-5 pt-16 text-white sm:p-6 sm:pt-20">
                <Logo inverted href={undefined} />
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                  Une identité claire pour une plateforme qui parle métier —
                  pas « encore un outil admin ».
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Produit stage */}
      <section id="produit" className="border-y border-line bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
          <Reveal>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Le produit
                </p>
                <h2 className="mt-3 font-display text-[1.75rem] font-semibold text-ink sm:text-4xl">
                  Un cockpit pour la journée d&apos;atelier.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-steel sm:mt-4 sm:text-base">
                  Priorités, agenda, demandes, encaissements — ce qu&apos;il
                  faut voir le matin, pas cinquante widgets inutiles.
                </p>
              </div>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/inscription">
                  Essayer le tableau de bord
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-8 sm:mt-12">
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink shadow-[0_40px_80px_-40px_rgba(7,21,37,0.55)] sm:rounded-[1.35rem]">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
                <span className="h-2 w-2 rounded-full bg-white/20 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-white/20 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-white/20 sm:h-2.5 sm:w-2.5" />
                <span className="ml-2 flex items-center gap-2 truncate text-[11px] text-white/40 sm:ml-3 sm:text-xs">
                  <LogoMark inverted size="sm" className="!h-5 !w-5" />
                  artisania.app / pilotage
                </span>
              </div>
              <div className="grid gap-px bg-white/10 lg:grid-cols-[14.5rem_1fr]">
                <aside className="hidden bg-ink p-5 text-white/70 lg:block">
                  <Logo inverted href={undefined} size="sm" />
                  <ul className="mt-7 space-y-1.5 text-sm">
                    {["Pilotage", "Clients", "Agenda", "Demandes", "Devis"].map(
                      (item, i) => (
                        <li
                          key={item}
                          className={
                            i === 0
                              ? "rounded-md bg-accent px-3 py-2 text-white"
                              : "rounded-md px-3 py-2"
                          }
                        >
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </aside>
                <div className="bg-[#0b1a2b] p-4 sm:p-7">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300/70 sm:text-[11px]">
                        Aujourd&apos;hui
                      </p>
                      <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                        Journée d&apos;atelier
                      </p>
                    </div>
                    <div className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white">
                      Focus
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                    {[
                      { l: "RDV", v: "2" },
                      { l: "Demandes", v: "1" },
                      { l: "Impayés", v: "1" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 sm:text-[11px]">
                          {s.l}
                        </p>
                        <p className="mt-1 font-display text-2xl font-semibold text-white sm:mt-2 sm:text-3xl">
                          {s.v}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:mt-4 sm:p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:text-xs">
                      Prochain créneau
                    </p>
                    <div className="mt-2 flex items-start gap-3 sm:mt-3 sm:gap-4">
                      <p className="font-display text-base font-semibold text-teal-200 sm:text-lg">
                        14:00
                      </p>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Diagnostic tableau électrique
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Jean Leroy · Lyon 6e
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Méthode */}
      <section id="methode" className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                La méthode
              </p>
              <h2 className="mt-3 font-display text-[1.75rem] font-semibold text-ink sm:text-4xl">
                Un fil. Du premier message à l&apos;encaissement.
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {[
              {
                step: "Demande",
                text: "Le particulier écrit depuis votre fiche. Tout arrive au même endroit.",
              },
              {
                step: "Agenda",
                text: "Un créneau confirmé. Le chantier entre dans le flux, pas dans WhatsApp.",
              },
              {
                step: "Exécution",
                text: "Intervention suivie, historique client, contexte sous la main.",
              },
              {
                step: "Facturation",
                text: "Devis et factures liés au dossier. Moins de ressaisie.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 70}>
                <div className="h-full rounded-xl border border-line bg-background p-5 sm:rounded-[1.1rem] sm:p-6">
                  <p className="font-display text-3xl font-semibold text-accent/25 sm:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink sm:mt-4 sm:text-xl">
                    {s.step}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deux portes */}
      <section className="bg-ink text-white atelier-grain">
        <div className="relative mx-auto grid max-w-6xl lg:grid-cols-2">
          <Reveal className="border-b border-white/10 p-8 sm:p-14 lg:border-b-0 lg:border-r">
            <LogoMark inverted size="md" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300/80 sm:mt-6">
              Artisans
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">
              Remplacez le bricolage opérationnel.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              CRM, agenda, demandes, paramètres entreprise et profil public —
              branchés sur de vraies données.
            </p>
            <Button asChild className="mt-7 w-full sm:mt-8 sm:w-auto" variant="accent">
              <Link href="/inscription">
                Créer mon compte artisan
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={100} className="p-8 sm:p-14">
            <LogoMark inverted size="md" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300/80 sm:mt-6">
              Particuliers
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">
              Trouvez le bon pro, sans friction.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Annuaire par métier et ville, profils clairs, demande
              d&apos;intervention en quelques minutes.
            </p>
            <Button
              asChild
              className="mt-7 w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:mt-8 sm:w-auto"
              variant="outline"
            >
              <Link href="/artisans">
                Voir les artisans
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden">
        <div className="atelier-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
          <Reveal>
            <Logo href={undefined} size="lg" />
            <h2 className="mt-6 max-w-3xl font-display text-[1.75rem] font-semibold text-ink sm:mt-8 sm:text-5xl sm:leading-[1.05]">
              L&apos;OS des artisans français commence ici.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-steel sm:mt-5 sm:text-base">
              Fondations solides aujourd&apos;hui. Messagerie, paiements et
              assistant IA sur la même base demain.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
                <Link href="/inscription">Commencer maintenant</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/connexion">J&apos;ai déjà un compte</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
