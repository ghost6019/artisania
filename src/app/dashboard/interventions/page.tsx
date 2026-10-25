export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const STATUS: Record<string, string> = {
  PENDING: "En attente",
  SCHEDULED: "Planifiée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export const metadata = { title: "Interventions" };

export default async function InterventionsPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const interventions = await prisma.intervention.findMany({
    where: { companyId },
    include: {
      customer: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="Interventions"
        description="Suivi des interventions (lecture + données seed pour cette version)."
        actions={
          <Button asChild variant="secondary">
            <Link href="/dashboard/agenda">Planifier via l&apos;agenda</Link>
          </Button>
        }
      />

      <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        La création complète d&apos;interventions (formulaire dédié + API CRUD)
        est prévue à l&apos;étape suivante. Les interventions ci-dessous
        proviennent de la base de données.
      </div>

      {interventions.length === 0 ? (
        <EmptyState
          title="Aucune intervention"
          description="Les interventions apparaîtront ici une fois créées."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Planifiée</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {i.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {i.customer
                      ? `${i.customer.firstName} ${i.customer.lastName}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {i.scheduledAt ? formatDateTime(i.scheduledAt) : "Non planifiée"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {STATUS[i.status] ?? i.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
