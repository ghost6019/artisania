export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileText,
  Plus,
  Receipt,
  Wrench,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/services/dashboard.service";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  PriorityStrip,
  type PriorityItem,
} from "@/components/dashboard/priority-strip";

const INTERVENTION_STATUS: Record<string, string> = {
  PENDING: "En attente",
  SCHEDULED: "Planifiée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export const metadata = { title: "Pilotage" };

export default async function DashboardPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const stats = await getDashboardStats(companyId);
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const priorities: PriorityItem[] = [];
  if (stats.pendingRequests > 0) {
    priorities.push({
      id: "requests",
      label: "Répondre aux demandes entrantes",
      detail: `${stats.pendingRequests} demande${stats.pendingRequests > 1 ? "s" : ""} en attente`,
      href: "/dashboard/demandes",
      urgency: "high",
    });
  }
  if (stats.unpaidInvoices > 0) {
    priorities.push({
      id: "invoices",
      label: "Relancer les factures impayées",
      detail: `${stats.unpaidInvoices} facture${stats.unpaidInvoices > 1 ? "s" : ""} à suivre`,
      href: "/dashboard/factures",
      urgency: "high",
    });
  }
  if (stats.appointmentsToday > 0) {
    priorities.push({
      id: "agenda",
      label: "Préparer les rendez-vous du jour",
      detail: `${stats.appointmentsToday} créneau${stats.appointmentsToday > 1 ? "x" : ""} planifié${stats.appointmentsToday > 1 ? "s" : ""}`,
      href: "/dashboard/agenda",
      urgency: "medium",
    });
  }
  if (stats.quotesPending > 0) {
    priorities.push({
      id: "quotes",
      label: "Faire avancer les devis ouverts",
      detail: `${stats.quotesPending} devis à traiter`,
      href: "/dashboard/devis",
      urgency: "low",
    });
  }

  const cards = [
    {
      label: "RDV du jour",
      value: stats.appointmentsToday,
      icon: CalendarDays,
      href: "/dashboard/agenda",
      tone: "default" as const,
    },
    {
      label: "Interventions",
      value: stats.upcomingInterventions,
      icon: Wrench,
      href: "/dashboard/interventions",
      tone: "default" as const,
    },
    {
      label: "Demandes",
      value: stats.pendingRequests,
      icon: ClipboardList,
      href: "/dashboard/demandes",
      tone: stats.pendingRequests > 0 ? ("accent" as const) : ("default" as const),
    },
    {
      label: "Devis ouverts",
      value: stats.quotesPending,
      icon: FileText,
      href: "/dashboard/devis",
      tone: "default" as const,
    },
    {
      label: "Impayés",
      value: stats.unpaidInvoices,
      icon: Receipt,
      href: "/dashboard/factures",
      tone: stats.unpaidInvoices > 0 ? ("warn" as const) : ("default" as const),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Pilotage"
        title="Votre journée d'atelier"
        description="Ce qui compte aujourd'hui — demandes, rendez-vous, encaissements."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="accent">
              <Link href="/dashboard/clients">
                <Plus className="h-4 w-4" />
                Client
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/agenda">
                <Plus className="h-4 w-4" />
                RDV
              </Link>
            </Button>
          </div>
        }
      />

      {isDemo ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <Badge variant="demo">Démo</Badge>
          <span>
            Données seed préfixées [DÉMO] — elles illustrent le produit, ce
            ne sont pas des données clients réelles.
          </span>
        </div>
      ) : null}

      <PriorityStrip items={priorities.slice(0, 3)} />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group last:col-span-2 xl:last:col-span-1"
          >
            <Card
              className={`h-full transition-[transform,box-shadow,border-color] duration-200 active:border-ink/15 sm:group-hover:-translate-y-0.5 sm:group-hover:border-ink/15 ${
                c.tone === "accent"
                  ? "border-accent/30 bg-accent-soft/40"
                  : c.tone === "warn"
                    ? "border-amber-200 bg-amber-50/50"
                    : ""
              }`}
            >
              <CardContent className="p-3.5 sm:p-5">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-steel sm:text-[11px] sm:tracking-[0.14em]">
                    {c.label}
                  </p>
                  <c.icon className="h-3.5 w-3.5 shrink-0 text-steel/70 sm:h-4 sm:w-4" />
                </div>
                <p className="mt-2 font-display text-2xl font-semibold text-ink sm:mt-3 sm:text-3xl">
                  {c.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-3 border-b border-line/80 bg-surface-muted/40 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="min-w-0">
              <CardTitle>Agenda du jour</CardTitle>
              <p className="mt-1 text-xs text-steel">
                Vue chronologique de vos rendez-vous
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="self-start sm:self-auto">
              <Link href="/dashboard/agenda">
                Agenda
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {stats.todayAgenda.length === 0 ? (
              <p className="px-6 py-10 text-sm text-steel">
                Aucun rendez-vous aujourd&apos;hui.{" "}
                <Link href="/dashboard/agenda" className="text-accent-ink underline">
                  En planifier un
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {stats.todayAgenda.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 px-4 py-3.5 transition-colors active:bg-surface-muted/40 sm:gap-4 sm:px-6 sm:py-4 sm:hover:bg-surface-muted/40"
                  >
                    <div className="w-12 shrink-0 pt-0.5 text-right sm:w-14">
                      <p className="font-display text-sm font-semibold text-ink">
                        {new Intl.DateTimeFormat("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(a.startsAt))}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1 border-l-2 border-accent/50 pl-3 sm:pl-4">
                      <p className="font-medium text-ink">{a.title}</p>
                      <p className="mt-0.5 text-xs text-steel">
                        {a.customer
                          ? `${a.customer.firstName} ${a.customer.lastName}`
                          : "Sans client"}
                        {a.location ? ` · ${a.location}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encaissé ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-semibold text-ink">
                {formatCurrency(stats.revenueMonthCents)}
              </p>
              <p className="mt-2 text-sm text-steel">
                Factures marquées payées sur le mois en cours.
              </p>
              <Button asChild variant="soft" size="sm" className="mt-4">
                <Link href="/dashboard/factures">Voir les factures</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Demandes entrantes</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/demandes">Tout</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recentRequests.length === 0 ? (
                <p className="text-sm text-steel">Aucune demande en attente.</p>
              ) : (
                <ul className="space-y-3">
                  {stats.recentRequests.map((r) => (
                    <li key={r.id} className="rounded-md border border-line p-3">
                      <p className="text-sm font-medium text-ink">{r.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-steel">
                        {r.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Prochaines interventions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/interventions">Voir tout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.nextInterventions.length === 0 ? (
            <p className="text-sm text-steel">Aucune intervention à venir.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stats.nextInterventions.map((i) => (
                <li
                  key={i.id}
                  className="rounded-[var(--radius-md)] border border-line bg-surface-muted/30 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-ink">{i.title}</p>
                    <Badge variant="secondary">
                      {INTERVENTION_STATUS[i.status] ?? i.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-steel">
                    {i.customer
                      ? `${i.customer.firstName} ${i.customer.lastName}`
                      : "Sans client"}
                    {i.scheduledAt
                      ? ` · ${formatDateTime(i.scheduledAt)}`
                      : " · Non planifiée"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
