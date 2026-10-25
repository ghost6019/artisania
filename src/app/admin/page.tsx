export const dynamic = "force-dynamic";

import { getAdminOverview } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Administration" };

export default async function AdminPage() {
  const overview = await getAdminOverview();

  const stats = [
    { label: "Utilisateurs", value: overview.stats.users },
    { label: "Entreprises", value: overview.stats.companies },
    { label: "Profils publics", value: overview.stats.profiles },
    { label: "Avis en attente", value: overview.stats.pendingReviews },
    { label: "Signalements ouverts", value: overview.stats.openReports },
    { label: "Demandes en attente", value: overview.stats.requests },
  ];

  return (
    <div>
      <PageHeader
        title="Administration"
        description="Vue générale de l'activité de la plateforme."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold text-navy-900">
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Derniers utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-navy-900">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{u.accountType}</Badge>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(u.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières entreprises</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentCompanies.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-navy-900">{c.name}</p>
                  <p className="text-xs text-slate-500">
                    {c.city ?? "—"} · {c._count.memberships} membre(s)
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={c.isActive ? "success" : "danger"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {c.isVerified ? (
                    <Badge variant="outline">Vérifiée</Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
