# Brain Hacking

A learn-anything platform that's really an **experimentation platform** — the
user is the test subject, comparing learning strategies (scheduling, ordering,
motivation) on themselves with real logged data. Subjects (chess, Mandarin, …)
are *data*, not code.

## How this repo governs itself

- **`docs/meta-principles.md`** — portable team charter (reusable across
  projects). **`docs/principles.md`** — this project's constitution. Both are
  inlined into `.kiro/steering/principles.md` (`inclusion: always`) so they load
  into every AI session automatically.
- **`docs/requirements/`** — one file per requirement (`R-NNN-*.md`) + an index.
  No feature without an R-id. Flow is requirement → test → app.

## Stack

Static SPA, no SSR, free hosting. Vite + SolidJS + Supabase (Postgres, free tier).
The browser talks to the DB directly; Row-Level Security is the only gatekeeper.
Rust/WASM is a future option for scheduler perf, not a current dependency.

## Run it

1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. Settings → API → Data API: expose the `public` schema **and** each table
   (`curricula`, `items`, `reviews`). Schema exposure alone is not enough — an
   unexposed table returns a misleading `Invalid API key`. RLS still gatekeeps.
3. `cp .env.example .env.local` and fill in URL + publishable key
   (Settings → API Keys). URL is the bare origin (`https://<ref>.supabase.co`,
   no `/rest/v1`). Use the `sb_publishable_...` key.
4. `npm install`
5. `npm run dev`

`npm run build` type-checks and outputs static files to `dist/`.

## Deploy (Vercel, auto on every `main` push)

The frontend is a static Vite build; Supabase is a separate always-on hosted
service the browser talks to directly (it is not part of the deploy build).

One-time setup in the Vercel dashboard:

1. **New Project → import this GitHub repo.** Vercel auto-detects Vite
   (build `npm run build`, output `dist/`) — no config needed.
2. **Project → Settings → Environment Variables**, add (Production + Preview):
   - `VITE_SUPABASE_URL` = `https://<ref>.supabase.co` (bare origin)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your `sb_publishable_...` key
   These are build-time vars baked into the bundle; the publishable key is
   public by design (RLS gatekeeps). Never put a secret key here.
3. **Supabase → Authentication → URL Configuration:** add the Vercel URL to
   redirect allow-list (needed once R-008 OAuth lands; harmless now).

After that, every push to `main` builds and deploys automatically. Preview
deploys are created for other branches/PRs.

Note: the deploy build runs `npm run build` only — **not** e2e, which needs
Docker + local Supabase. e2e stays a local pre-push gate (`npm run test:e2e`).
Schema changes are NOT auto-deployed to the hosted DB yet — see R-011.

## Status

R-001 (data model), R-002 (review player + pluggable scheduler), and R-009
(automated e2e) are done. Schedulers, experiment tooling, and content authoring
are deferred — see `docs/requirements/`.
