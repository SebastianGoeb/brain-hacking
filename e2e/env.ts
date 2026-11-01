import { execSync } from "node:child_process";

// Read local Supabase keys at runtime from the running stack — nothing
// secret-shaped is committed (keeps GitHub secret-scanning happy, and keeps the
// rule "secrets never live in the repo" even for throwaway local defaults).
// Requires `supabase start` to be up.
function localEnv(): Record<string, string> {
  const out = execSync("npx supabase status -o env", { encoding: "utf8" });
  const env: Record<string, string> = {};
  for (const line of out.split("\n")) {
    const m = line.match(/^(\w+)="?(.*?)"?$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = localEnv();
export const LOCAL_SUPABASE_URL = env.API_URL;
export const LOCAL_PUBLISHABLE_KEY = env.PUBLISHABLE_KEY;
export const LOCAL_SECRET_KEY = env.SECRET_KEY;
