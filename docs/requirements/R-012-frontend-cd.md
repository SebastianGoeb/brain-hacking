# R-012 Frontend continuous deploy on Vercel — ✅ done

Why: every `main` push should be live on the internet with no manual step.

Done when: pushing to `main` builds the static Vite app and deploys it; the
deployed app talks to the hosted Supabase project. ✅ verified: deployed app
loads and runs against hosted Supabase.

## Setup (recorded so it's reproducible)

- Vercel auto-detects Vite (build `npm run build`, output `dist/`); no
  `vercel.json` needed (no router yet → no SPA rewrite needed).
- Env vars set in Vercel (Production + Preview), read at BUILD time, baked into
  the bundle: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Publishable
  key is public by design (RLS gatekeeps); a secret key must never go here.
- `@supabase/supabase-js` must be a runtime `dependency` (not dev) or Vercel's
  clean install fails with TS2307 — local dirty node_modules masked this once.

## Not covered

- Schema deploy to the hosted DB is separate — see R-011.
- e2e does not run on Vercel (needs Docker + local Supabase); it stays a local
  pre-push gate.
