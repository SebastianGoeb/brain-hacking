import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — copy .env.example to .env.local");
}

export const supabase = createClient(url, key);

// R-002: reviews are RLS-scoped to auth.uid(), so we need a user. Anonymous
// sign-in (R-008 upgrades this to OAuth) gives a stable per-browser uid with no
// login UI. Requires "Anonymous sign-ins" enabled in Auth → Providers.
export async function ensureUser() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user;
  const { data: signed, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return signed.user!;
}
