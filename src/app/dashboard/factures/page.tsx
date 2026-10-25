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
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export const metadata = { title: "Factures" };

export default async function FacturesPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const invoices = await prisma.invoice.findMany({
    where: { companyId },
    include: {
      customer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Factures"
        description="Consultation des factures (création complète prévue à l'étape suivante)."
      />

      <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Affichage connecté à la base. L&apos;éditeur de factures et les paiements
        en ligne arriveront plus tard.
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title="Aucune facture"
          description="Les factures créées apparaîtront ici."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Émission</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {inv.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {inv.customer
                      ? `${inv.customer.firstName} ${inv.customer.lastName}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(inv.totalCents)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        inv.status === "PAID"
                          ? "success"
                          : inv.status === "OVERDUE" || inv.status === "SENT"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {STATUS[inv.status] ?? inv.status}
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
