export const dynamic = "force-dynamic";

import { listUsersForAdmin } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Utilisateurs" };

export default async function AdminUsersPage() {
  const users = await listUsersForAdmin();

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        description="Liste des comptes inscrits sur la plateforme."
      />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Entreprises</th>
              <th className="px-4 py-3 font-medium">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{u.accountType}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      u.globalRole === "PLATFORM_ADMIN" ? "default" : "outline"
                    }
                  >
                    {u.globalRole}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {u.memberships.length === 0
                    ? "—"
                    : u.memberships
                        .map((m) => `${m.company.name} (${m.role})`)
                        .join(", ")}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
