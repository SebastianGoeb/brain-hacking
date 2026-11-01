# R-011 Deploy schema/migrations to the hosted Supabase project — 💤 deferred

Why: the frontend auto-deploys on push (Vercel), but DB schema does not. Local
uses `supabase/migrations/`; the hosted project is currently hand-edited via the
SQL editor. Any schema change (R-003+) will drift prod from local until applied
by hand — a silent, dangerous gap.

Done when: schema changes reach the hosted project through migrations, not
hand-editing — `supabase link` + `supabase db push` (manually or in CI on
`main`). Local e2e and prod share one migration source of truth.

Notes: not built yet (meta-principle 4) — one table set, applied by hand once,
works for now. Build when the first *post-deploy* schema change lands (likely
R-003). If CI-driven, it needs the project ref + a Supabase access token as CI
secrets — the one place a real secret is unavoidable, kept in CI config only,
never in the repo.
