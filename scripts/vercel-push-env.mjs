import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function parseEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const local = parseEnv(".env");
const authSecret = existsSync(".vercel-auth-secret.tmp")
  ? readFileSync(".vercel-auth-secret.tmp", "utf8").trim()
  : local.AUTH_SECRET;

const keys = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "AUTH_SECRET",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_DEMO_MODE",
  "NEON_BRANCH",
];

const values = {
  ...local,
  AUTH_SECRET: authSecret || local.AUTH_SECRET,
  NEXT_PUBLIC_DEMO_MODE: local.NEXT_PUBLIC_DEMO_MODE ?? "true",
  NEXT_PUBLIC_APP_NAME: local.NEXT_PUBLIC_APP_NAME ?? "Artisania",
};

const targets = ["production", "preview", "development"];

for (const key of keys) {
  const value = values[key];
  if (!value) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
  for (const target of targets) {
    // Remove existing quietly, then add
    spawnSync("npx", ["vercel", "env", "rm", key, target, "-y"], {
      stdio: ["ignore", "ignore", "ignore"],
      shell: true,
    });
    const res = spawnSync(
      "npx",
      ["vercel", "env", "add", key, target],
      {
        input: value + "\n",
        encoding: "utf8",
        shell: true,
      },
    );
    if (res.status !== 0) {
      console.error(`Failed to set ${key} (${target})`);
      console.error(res.stderr || res.stdout);
      process.exit(res.status ?? 1);
    }
    console.log(`OK ${key} → ${target}`);
  }
}

console.log("Env vars pushed (values not printed).");
