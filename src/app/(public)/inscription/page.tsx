import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Inscription" };

export default function RegisterPage() {
  return (
    <div className="relative flex justify-center px-4 py-16 sm:px-6 lg:py-24">
      <div className="atelier-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Rejoindre Artisania
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            Créer votre espace
          </h1>
          <p className="mt-2 text-sm text-steel">
            Artisan ou particulier — même plateforme, deux expériences.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
