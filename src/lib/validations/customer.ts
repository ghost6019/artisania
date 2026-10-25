import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(80),
  lastName: z.string().min(1, "Nom requis").max(80),
  email: z
    .string()
    .email("E-mail invalide")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  addressLine1: z.string().max(200).optional().or(z.literal("")),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  isProspect: z.boolean().optional().default(false),
});

export type CustomerInput = z.infer<typeof customerSchema>;
