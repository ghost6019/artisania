"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export type CustomerRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  postalCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  notes: string | null;
  isProspect: boolean;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  notes: "",
  isProspect: false,
};

type Props = { initialCustomers: CustomerRow[] };

export function CustomersManager({ initialCustomers }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.firstName, c.lastName, c.email, c.phone, c.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [customers, search]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(customer: CustomerRow) {
    setEditingId(customer.id);
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      addressLine1: customer.addressLine1 ?? "",
      addressLine2: customer.addressLine2 ?? "",
      city: customer.city ?? "",
      postalCode: customer.postalCode ?? "",
      notes: customer.notes ?? "",
      isProspect: customer.isProspect,
    });
    setShowForm(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId
        ? `/api/v1/customers/${editingId}`
        : "/api/v1/customers";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Enregistrement impossible.");
        return;
      }

      toast.success(editingId ? "Client mis à jour." : "Client créé.");
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      router.refresh();

      if (editingId) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingId ? json.data : c)),
        );
      } else {
        setCustomers((prev) => [...prev, json.data]);
      }
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer ce client ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/customers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Suppression impossible.");
        return;
      }
      toast.success("Client supprimé.");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Gérez vos clients et prospects."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nouveau client
          </Button>
        }
      />

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? "Modifier le client" : "Nouveau client"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Adresse</Label>
                <Input
                  id="addressLine1"
                  value={form.addressLine1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, addressLine1: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, postalCode: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-navy-800">
                <input
                  type="checkbox"
                  checked={form.isProspect}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isProspect: e.target.checked }))
                  }
                />
                Marquer comme prospect
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement…" : "Enregistrer"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun client"
          description="Ajoutez votre premier client pour démarrer le suivi CRM."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Ajouter un client
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{c.email ?? "—"}</div>
                    <div className="text-xs">{c.phone ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isProspect ? "warning" : "success"}>
                      {c.isProspect ? "Prospect" : "Client"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(c)}
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(c.id)}
                      aria-label="Supprimer"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
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
