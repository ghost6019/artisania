import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="relative flex justify-center px-4 py-16 sm:px-6 lg:py-24">
      <div className="atelier-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Accès atelier
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            Bon retour
          </h1>
        </div>
        <Suspense
          fallback={
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 text-sm text-steel">
              Chargement…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
