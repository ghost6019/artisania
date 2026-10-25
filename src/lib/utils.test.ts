import { describe, expect, it } from "vitest";
import { formatCurrency, fullName, slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normalise les accents et espaces", () => {
    expect(slugify("Électricité Dupont Lyon")).toBe("electricite-dupont-lyon");
  });
});

describe("formatCurrency", () => {
  it("formate les centimes en euros", () => {
    expect(formatCurrency(21600)).toContain("216");
  });
});

describe("fullName", () => {
  it("concatène prénom et nom", () => {
    expect(fullName("Marc", "Dupont")).toBe("Marc Dupont");
  });
});
