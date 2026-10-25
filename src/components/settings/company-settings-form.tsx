"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type CompanyData = {
  name: string;
  legalName: string | null;
  siret: string | null;
  vatNumber: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
  description: string | null;
};

type ProfileData = {
  trade: string;
  bio: string | null;
  serviceArea: string | null;
  city: string | null;
  postalCode: string | null;
  yearsExperience: number | null;
  isPublic: boolean;
} | null;

type Props = {
  company: CompanyData;
  profile: ProfileData;
};

export function CompanySettingsForm({ company, profile }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: company.name,
    legalName: company.legalName ?? "",
    siret: company.siret ?? "",
    vatNumber: company.vatNumber ?? "",
    email: company.email ?? "",
    phone: company.phone ?? "",
    website: company.website ?? "",
    addressLine1: company.addressLine1 ?? "",
    addressLine2: company.addressLine2 ?? "",
    city: company.city ?? "",
    postalCode: company.postalCode ?? "",
    description: company.description ?? "",
  });
  const [profileForm, setProfileForm] = useState({
    trade: profile?.trade ?? "",
    bio: profile?.bio ?? "",
    serviceArea: profile?.serviceArea ?? "",
    city: profile?.city ?? "",
    postalCode: profile?.postalCode ?? "",
    yearsExperience: profile?.yearsExperience?.toString() ?? "",
    isPublic: profile?.isPublic ?? true,
  });

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/v1/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Enregistrement impossible.");
        return;
      }
      toast.success("Entreprise mise à jour.");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/v1/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "profile",
          data: {
            ...profileForm,
            yearsExperience: profileForm.yearsExperience
              ? Number(profileForm.yearsExperience)
              : null,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error?.message ?? "Enregistrement impossible.");
        return;
      }
      toast.success("Profil public mis à jour.");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entreprise</CardTitle>
          <CardDescription>Informations légales et de contact.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveCompany} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom commercial</Label>
                <Input
                  required
                  value={companyForm.name}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Raison sociale</Label>
                <Input
                  value={companyForm.legalName}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, legalName: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SIRET</Label>
                <Input
                  value={companyForm.siret}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, siret: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>N° TVA</Label>
                <Input
                  value={companyForm.vatNumber}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, vatNumber: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={companyForm.email}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={companyForm.phone}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={companyForm.addressLine1}
                onChange={(e) =>
                  setCompanyForm((f) => ({ ...f, addressLine1: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  value={companyForm.city}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input
                  value={companyForm.postalCode}
                  onChange={(e) =>
                    setCompanyForm((f) => ({ ...f, postalCode: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={companyForm.description}
                onChange={(e) =>
                  setCompanyForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer l'entreprise"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profil public</CardTitle>
          <CardDescription>
            Visible dans l&apos;annuaire des artisans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Métier</Label>
                <Input
                  required
                  value={profileForm.trade}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, trade: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Années d&apos;expérience</Label>
                <Input
                  type="number"
                  min={0}
                  value={profileForm.yearsExperience}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      yearsExperience: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Zone d&apos;intervention</Label>
                <Input
                  value={profileForm.serviceArea}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, serviceArea: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Présentation</Label>
              <Textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, bio: e.target.value }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profileForm.isPublic}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, isPublic: e.target.checked }))
                }
              />
              Profil visible dans l&apos;annuaire
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer le profil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
