export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listAuthorServiceRequests } from "@/services/service-request.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

const STATUS: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  REJECTED: "Refusée",
};

export const metadata = { title: "Mon espace" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/compte");

  const requests = await listAuthorServiceRequests(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Mon espace</h1>
          <p className="text-sm text-slate-500">{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          {session.user.activeCompanyId ? (
            <Button asChild>
              <Link href="/dashboard">Espace artisan</Link>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/artisans">Trouver un artisan</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes demandes d&apos;intervention</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <EmptyState
              title="Aucune demande"
              description="Parcourez l'annuaire pour contacter un artisan."
              action={
                <Button asChild>
                  <Link href="/artisans">Voir les artisans</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-navy-900">{r.title}</p>
                    <Badge variant="secondary">
                      {STATUS[r.status] ?? r.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {r.company?.name ?? r.artisanProfile?.trade ?? "Sans artisan"}{" "}
                    · {formatDate(r.createdAt)}
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
