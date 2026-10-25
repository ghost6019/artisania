export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const STATUS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  ACCEPTED: "Accepté",
  REJECTED: "Refusé",
  EXPIRED: "Expiré",
};

export const metadata = { title: "Devis" };

export default async function DevisPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const quotes = await prisma.quote.findMany({
    where: { companyId },
    include: {
      customer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Devis"
        description="Consultation des devis (création complète prévue à l'étape suivante)."
      />

      <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Le modèle de données et l&apos;affichage sont en place. L&apos;éditeur de
        devis (lignes, TVA, envoi) sera développé ensuite.
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          title="Aucun devis"
          description="Les devis créés apparaîtront ici."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{q.number}</td>
                  <td className="px-4 py-3 font-medium text-navy-900">{q.title}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {q.customer
                      ? `${q.customer.firstName} ${q.customer.lastName}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(q.issueDate)}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(q.totalCents)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {STATUS[q.status] ?? q.status}
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
