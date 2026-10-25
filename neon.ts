import { defineConfig } from "@neon/config/v1";

/**
 * Politique Neon — Postgres uniquement (Artisania / Prisma).
 * Auth, Functions, Object Storage, etc. pourront être ajoutés plus tard.
 */
export default defineConfig({
  auth: false,
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
