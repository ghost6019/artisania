export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listCompanyServiceRequests } from "@/services/service-request.service";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";

const STATUS: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  REJECTED: "Refusée",
};

export const metadata = { title: "Demandes" };

export default async function DemandesPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const requests = await listCompanyServiceRequests(companyId);

  return (
    <div>
      <PageHeader
        title="Demandes clients"
        description="Demandes d'intervention reçues via le site public."
      />

      {requests.length === 0 ? (
        <EmptyState
          title="Aucune demande"
          description="Les demandes apparaîtront lorsque des particuliers vous contacteront."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-navy-900">{r.title}</h3>
                <Badge variant={r.status === "PENDING" ? "warning" : "secondary"}>
                  {STATUS[r.status] ?? r.status}
                </Badge>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                {r.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{formatDate(r.createdAt)}</span>
                {r.city ? <span>{r.city}</span> : null}
                {r.phone ? <span>{r.phone}</span> : null}
                {r.email ? <span>{r.email}</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
