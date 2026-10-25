import { z } from "zod";

export const companySettingsSchema = z.object({
  name: z.string().min(1, "Nom requis").max(120),
  legalName: z.string().max(160).optional().or(z.literal("")),
  siret: z
    .string()
    .regex(/^\d{14}$|^$/, "SIRET : 14 chiffres")
    .optional()
    .or(z.literal("")),
  vatNumber: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("E-mail invalide").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  website: z
    .union([z.string().url("URL invalide"), z.literal("")])
    .optional(),
  addressLine1: z.string().max(200).optional().or(z.literal("")),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
});

export const artisanProfileSchema = z.object({
  trade: z.string().min(1, "Métier requis").max(80),
  bio: z.string().max(5000).optional().or(z.literal("")),
  serviceArea: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().int().min(0).max(80).optional().nullable(),
  isPublic: z.boolean().optional().default(true),
});

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
export type ArtisanProfileInput = z.infer<typeof artisanProfileSchema>;
