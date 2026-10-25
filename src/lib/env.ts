/**
 * URLs d'app selon l'environnement (local / Vercel preview / production).
 */
export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

/** Assure AUTH_URL pour Auth.js derrière Vercel (preview + prod). */
export function ensureAuthUrl() {
  if (!process.env.AUTH_URL && process.env.VERCEL_URL) {
    process.env.AUTH_URL = `https://${process.env.VERCEL_URL}`;
  }
}
