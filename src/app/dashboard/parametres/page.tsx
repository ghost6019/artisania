export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCompanyWithProfile } from "@/services/company.service";
import { CompanySettingsForm } from "@/components/settings/company-settings-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Paramètres" };

export default async function ParametresPage() {
  const session = await auth();
  const companyId = session?.user?.activeCompanyId;
  if (!companyId) redirect("/compte");

  const company = await getCompanyWithProfile(companyId);
  if (!company) redirect("/dashboard");

  const profile = company.artisanProfiles[0] ?? null;

  return (
    <div>
      <PageHeader
        title="Paramètres"
        description="Compte entreprise et profil public."
      />
      <CompanySettingsForm
        company={company}
        profile={
          profile
            ? {
                trade: profile.trade,
                bio: profile.bio,
                serviceArea: profile.serviceArea,
                city: profile.city,
                postalCode: profile.postalCode,
                yearsExperience: profile.yearsExperience,
                isPublic: profile.isPublic,
              }
            : null
        }
      />
    </div>
  );
}
