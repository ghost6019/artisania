import { z } from "zod";

export const serviceRequestSchema = z.object({
  title: z.string().min(1, "Titre requis").max(160),
  description: z.string().min(10, "Décrivez votre besoin (10 caractères min)").max(5000),
  trade: z.string().max(80).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("E-mail invalide").optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
  artisanProfileId: z.string().cuid().optional(),
  companyId: z.string().cuid().optional(),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
