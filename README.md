# Brain Hacking

A learn-anything platform that's really an **experimentation platform** — the
user is the test subject, comparing learning strategies (scheduling, ordering,
motivation) on themselves with real logged data. Subjects (chess, Mandarin, …)
are *data*, not code.

## How this repo governs itself

- **`docs/principles.md`** — the constitution. Read it first. It's loaded into
  every AI session via `.kiro/steering/principles.md` so we don't drift.
- **`docs/requirements/`** — one file per requirement (`R-NNN-*.md`) + an index.
  No feature without an R-id.

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

`npm run build` type-checks and outputs static files to `dist/` — deploy that
folder to any free static host (Vercel, Netlify, Cloudflare Pages).

## Status

Spine only. R-001 (data model) is built; the review player, schedulers, and
experiment tooling are deferred requirements — see `docs/requirements/`.
