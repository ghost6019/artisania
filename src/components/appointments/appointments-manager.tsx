"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

type CustomerOption = { id: string; firstName: string; lastName: string };

type AppointmentRow = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string | Date;
  endsAt: string | Date;
  status: string;
  location: string | null;
  customer: { id: string; firstName: string; lastName: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Planifié",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  NO_SHOW: "Absent",
};

type Props = {
  initialAppointments: AppointmentRow[];
  customers: CustomerOption[];
};

export function AppointmentsManager({ initialAppointments, customers }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialAppointments);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    customerId: "",
    startsAt: "",
    endsAt: "",
    location: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const startsAt = new Date(form.startsAt).toISOString();
      const endsAt = new Date(form.endsAt).toISOString();
      const res = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          customerId: form.customerId || null,
          startsAt,
          endsAt,
          location: form.location,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Création impossible.");
        return;
      }
      toast.success("Rendez-vous créé.");
      setItems((prev) =>
        [...prev, json.data].sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        ),
      );
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        customerId: "",
        startsAt: "",
        endsAt: "",
        location: "",
      });
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function onCancel(id: string) {
    const item = items.find((a) => a.id === id);
    if (!item) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description ?? "",
          customerId: item.customer?.id ?? null,
          startsAt: new Date(item.startsAt).toISOString(),
          endsAt: new Date(item.endsAt).toISOString(),
          location: item.location ?? "",
          status: "CANCELLED",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Annulation impossible.");
        return;
      }
      toast.success("Rendez-vous annulé.");
      setItems((prev) => prev.map((a) => (a.id === id ? json.data : a)));
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
        title="Agenda"
        description="Planifiez et suivez vos rendez-vous."
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nouveau rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerId: e.target.value }))
                  }
                >
                  <option value="">— Aucun —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Début</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={form.startsAt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startsAt: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fin</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={form.endsAt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endsAt: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lieu</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Création…" : "Créer"}
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

      {items.length === 0 ? (
        <EmptyState
          title="Aucun rendez-vous"
          description="Créez votre premier rendez-vous pour commencer."
        />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-navy-900">{a.title}</p>
                    <Badge variant="secondary">
                      {STATUS_LABEL[a.status] ?? a.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(a.startsAt)} → {formatDateTime(a.endsAt)}
                  </p>
                  {a.customer ? (
                    <p className="text-sm text-slate-600">
                      {a.customer.firstName} {a.customer.lastName}
                    </p>
                  ) : null}
                  {a.location ? (
                    <p className="text-xs text-slate-500">{a.location}</p>
                  ) : null}
                </div>
                {a.status !== "CANCELLED" && a.status !== "COMPLETED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => onCancel(a.id)}
                  >
                    Annuler
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
