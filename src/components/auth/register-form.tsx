"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "ARTISAN">(
    "ARTISAN",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      phone: String(form.get("phone") ?? ""),
      accountType,
      companyName: String(form.get("companyName") ?? ""),
      trade: String(form.get("trade") ?? ""),
      city: String(form.get("city") ?? ""),
    };

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Inscription impossible.");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Compte créé. Vous pouvez vous connecter.");
        router.push("/connexion");
        return;
      }

      toast.success("Bienvenue ! Votre compte est prêt.");
      router.push(accountType === "ARTISAN" ? "/dashboard" : "/compte");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez la plateforme en tant que particulier ou artisan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setAccountType("ARTISAN")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              accountType === "ARTISAN"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            Artisan
          </button>
          <button
            type="button"
            onClick={() => setAccountType("INDIVIDUAL")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              accountType === "INDIVIDUAL"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            Particulier
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="8 caractères, lettre et chiffre"
            />
          </div>

          {accountType === "ARTISAN" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                <Input id="companyName" name="companyName" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trade">Métier</Label>
                  <Input
                    id="trade"
                    name="trade"
                    required
                    placeholder="Électricien, Plombier…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" name="city" placeholder="Lyon" />
                </div>
              </div>
            </>
          ) : null}

          <Button type="submit" className="w-full" variant="accent" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-medium text-navy-800 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
