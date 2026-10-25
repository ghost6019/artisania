import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactivé pour la v1 : auth + données Prisma dynamiques
  // (réactiver progressivement avec cache/PPR plus tard)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
