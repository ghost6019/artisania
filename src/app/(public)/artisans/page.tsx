export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowUpRight, MapPin, Search, Star } from "lucide-react";
import { searchArtisans, listTrades } from "@/services/artisan.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

type Props = {
  searchParams: Promise<{ q?: string; trade?: string; city?: string }>;
};

export const metadata = {
  title: "Annuaire des artisans",
};

export default async function ArtisansPage({ searchParams }: Props) {
  const params = await searchParams;
  const [artisans, trades] = await Promise.all([
    searchArtisans({
      q: params.q,
      trade: params.trade,
      city: params.city,
    }),
    listTrades(),
  ]);

  return (
    <div>
      <section className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto max-w-6xl safe-px py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300/80">
            Annuaire
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-[1.85rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            Des artisans vérifiés, près de chez vous.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Filtrez par métier et localisation, consultez le profil, envoyez
            une demande d&apos;intervention.
          </p>

          <form className="mt-6 grid gap-2 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-2.5 backdrop-blur sm:mt-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <Input
              name="q"
              defaultValue={params.q}
              placeholder="Mot-clé, métier…"
              className="border-white/10 bg-white/95 sm:col-span-2 lg:col-span-1"
              autoComplete="off"
              enterKeyHint="search"
            />
            <select
              name="trade"
              defaultValue={params.trade ?? ""}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/95 px-3 text-base text-ink sm:h-10 sm:text-sm"
            >
              <option value="">Tous les métiers</option>
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Input
              name="city"
              defaultValue={params.city}
              placeholder="Ville"
              className="border-white/10 bg-white/95"
              autoComplete="address-level2"
            />
            <Button type="submit" variant="accent" className="h-11 w-full sm:col-span-2 sm:h-10 lg:col-span-1" aria-label="Rechercher">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl safe-px py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
          <p className="text-sm text-steel">
            <span className="font-semibold text-ink">{artisans.length}</span>{" "}
            profil{artisans.length > 1 ? "s" : ""} public
            {artisans.length > 1 ? "s" : ""}
          </p>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/inscription">
              Je suis artisan
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {artisans.length === 0 ? (
          <EmptyState
            title="Aucun artisan trouvé"
            description="Élargissez vos critères, ou créez le premier profil de votre métier."
            action={
              <Button asChild variant="accent">
                <Link href="/inscription">Devenir artisan partenaire</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((a) => (
              <Link
                key={a.id}
                href={`/artisans/${a.slug}`}
                className="group flex flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-[transform,border-color] duration-200 active:border-ink/20 sm:p-6 sm:hover:-translate-y-0.5 sm:hover:border-ink/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink group-hover:text-accent-ink">
                      {a.company.name}
                    </p>
                    <p className="mt-0.5 text-sm text-steel">
                      {a.user.firstName} {a.user.lastName}
                    </p>
                  </div>
                  {a.company.isVerified ? (
                    <Badge variant="success">Vérifié</Badge>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{a.trade}</Badge>
                  {a.city ? (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {a.city}
                    </Badge>
                  ) : null}
                </div>

                {a.bio ? (
                  <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-steel">
                    {a.bio}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-steel">
                  {a.ratingCount > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {a.ratingAvg.toFixed(1)} · {a.ratingCount} avis
                    </span>
                  ) : (
                    <span>Nouveau sur Artisania</span>
                  )}
                  <span className="font-medium text-accent-ink opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    Voir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
