"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  artisanProfileId?: string;
  companyId?: string;
  trade?: string;
  onSuccess?: () => void;
};

export function ServiceRequestForm({
  artisanProfileId,
  companyId,
  trade,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      trade: trade ?? String(form.get("trade") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      preferredDate: String(form.get("preferredDate") ?? "") || undefined,
      artisanProfileId,
      companyId,
    };

    try {
      const res = await fetch("/api/v1/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Envoi impossible.");
        return;
      }
      toast.success("Demande envoyée.");
      setDone(true);
      onSuccess?.();
      e.currentTarget.reset();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p className="font-semibold">Demande bien reçue</p>
        <p className="mt-1">
          L&apos;artisan a été notifié dans son espace. Vous pourrez suivre vos
          demandes depuis votre compte.
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => setDone(false)}
        >
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Objet</Label>
        <Input id="title" name="title" required placeholder="Ex. Fuite sous évier" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          placeholder="Décrivez le problème, l'urgence, l'accès…"
        />
      </div>
      {!trade ? (
        <div className="space-y-2">
          <Label htmlFor="trade">Métier recherché</Label>
          <Input id="trade" name="trade" placeholder="Plombier, Électricien…" />
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal</Label>
          <Input id="postalCode" name="postalCode" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredDate">Date souhaitée (optionnel)</Label>
        <Input id="preferredDate" name="preferredDate" type="date" />
      </div>
      <p className="text-xs text-slate-500">
        L&apos;envoi de photos sera disponible dans une prochaine version.
      </p>
      <Button type="submit" disabled={loading}>
        {loading ? "Envoi…" : "Envoyer la demande"}
      </Button>
    </form>
  );
}
