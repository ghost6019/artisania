import { z } from "zod";

export const appointmentSchema = z
  .object({
    title: z.string().min(1, "Titre requis").max(160),
    description: z.string().max(5000).optional().or(z.literal("")),
    customerId: z.string().cuid().optional().nullable(),
    startsAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    endsAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    location: z.string().max(200).optional().or(z.literal("")),
    status: z
      .enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"])
      .optional(),
  })
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: "La fin doit être après le début",
    path: ["endsAt"],
  });

export type AppointmentInput = z.infer<typeof appointmentSchema>;
