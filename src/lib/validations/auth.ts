import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Prénom requis").max(80),
    lastName: z.string().min(1, "Nom requis").max(80),
    email: z.string().email("Adresse e-mail invalide"),
    password: z
      .string()
      .min(8, "Au moins 8 caractères")
      .regex(/[A-Za-z]/, "Doit contenir une lettre")
      .regex(/[0-9]/, "Doit contenir un chiffre"),
    phone: z.string().optional(),
    accountType: z.enum(["INDIVIDUAL", "ARTISAN"]),
    companyName: z.string().max(120).optional(),
    trade: z.string().max(80).optional(),
    city: z.string().max(80).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "ARTISAN") {
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Nom de l'entreprise requis",
          path: ["companyName"],
        });
      }
      if (!data.trade?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Métier requis",
          path: ["trade"],
        });
      }
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
