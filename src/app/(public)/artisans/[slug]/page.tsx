export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ShieldCheck, ArrowLeft } from "lucide-react";
import { getPublicArtisanBySlug } from "@/services/artisan.service";
import { ServiceRequestForm } from "@/components/service-requests/service-request-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artisan = await getPublicArtisanBySlug(slug);
  if (!artisan) return { title: "Artisan introuvable" };
  return {
    title: `${artisan.company.name} — ${artisan.trade}`,
    description: artisan.bio ?? undefined,
  };
}

export default async function ArtisanProfilePage({ params }: Props) {
  const { slug } = await params;
  const artisan = await getPublicArtisanBySlug(slug);
  if (!artisan) notFound();

  return (
    <div>
      <section className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto max-w-6xl safe-px py-8 sm:px-6 sm:py-10">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 min-h-11 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Link href="/artisans">
              <ArrowLeft className="h-4 w-4" />
              Annuaire
            </Link>
          </Button>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6">
            <Badge variant="secondary" className="bg-white/10 text-white border-0">
              {artisan.trade}
            </Badge>
            {artisan.company.isVerified ? (
              <Badge className="gap-1 border-0 bg-accent text-white">
                <ShieldCheck className="h-3 w-3" />
                Vérifié
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-[1.85rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            {artisan.company.name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
            <span>
              {artisan.user.firstName} {artisan.user.lastName}
            </span>
            {artisan.city ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {artisan.city}
              </span>
            ) : null}
            {artisan.yearsExperience ? (
              <span>{artisan.yearsExperience} ans d&apos;expérience</span>
            ) : null}
            {artisan.ratingCount > 0 ? (
              <span>
                {artisan.ratingAvg.toFixed(1)}/5 · {artisan.ratingCount} avis
              </span>
            ) : null}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 safe-px py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-5">
        <div className="order-2 lg:order-1 lg:col-span-3">
          {artisan.bio ? (
            <p className="text-base leading-relaxed text-ink/90 whitespace-pre-wrap">
              {artisan.bio}
            </p>
          ) : null}

          {artisan.company.description ? (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                L&apos;entreprise
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-steel">
                {artisan.company.description}
              </p>
            </div>
          ) : null}

          <div className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink">Avis</h2>
            {artisan.reviews.length === 0 ? (
              <p className="mt-3 text-sm text-steel">
                Pas encore d&apos;avis publiés.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {artisan.reviews.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-[var(--radius-md)] border border-line bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-ink">
                        {r.authorName ?? "Client"}
                      </p>
                      <span className="text-sm font-semibold text-accent-ink">
                        {r.rating}/5
                      </span>
                    </div>
                    {r.comment ? (
                      <p className="mt-2 text-sm leading-relaxed text-steel">
                        {r.comment}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-steel/70">
                      {formatDate(r.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-2">
          <Card
            id="demande"
            className="border-ink/10 lg:sticky lg:top-[calc(5.5rem+env(safe-area-inset-top))]"
          >
            <CardHeader className="border-b border-line bg-surface-muted/40">
              <CardTitle>Demander une intervention</CardTitle>
              <p className="text-sm text-steel">
                Décrivez votre besoin — l&apos;artisan le reçoit dans son atelier.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ServiceRequestForm
                artisanProfileId={artisan.id}
                companyId={artisan.company.id}
                trade={artisan.trade}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
