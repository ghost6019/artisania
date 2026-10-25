"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Identifiants incorrects.");
      return;
    }

    toast.success("Connexion réussie.");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-ink/10">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Artisan, particulier ou administrateur — un seul accès sécurisé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vous@exemple.fr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full" variant="accent" disabled={loading}>
            {loading ? "Connexion…" : "Entrer dans l'atelier"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-steel">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-accent-ink hover:underline">
            Créer un compte
          </Link>
        </p>
        {process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
            <p className="font-semibold">Comptes de démonstration</p>
            <p className="mt-1">Mot de passe : Demo2026!</p>
            <ul className="mt-2 space-y-0.5 font-mono">
              <li>artisan@artisania.local</li>
              <li>particulier@artisania.local</li>
              <li>admin@artisania.local</li>
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
