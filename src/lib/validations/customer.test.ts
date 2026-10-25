import { describe, expect, it } from "vitest";
import { customerSchema } from "@/lib/validations/customer";

describe("customerSchema", () => {
  it("valide un client minimal", () => {
    const result = customerSchema.safeParse({
      firstName: "Jean",
      lastName: "Leroy",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un e-mail invalide", () => {
    const result = customerSchema.safeParse({
      firstName: "Jean",
      lastName: "Leroy",
      email: "pas-un-email",
    });
    expect(result.success).toBe(false);
  });
});
