# R-011 Deploy schema/migrations to the hosted Supabase project — 🔨 building

Why: the frontend auto-deploys on merge (Vercel), but DB schema did not —
migrations were hand-applied to prod via the SQL editor. That drifts prod from
local and already nearly broke a deploy (the reviews.grade column). Close the
gap: migrations reach prod automatically.

Done when: merging a migration into `main` applies it to the hosted project
with no manual step. ✅ workflow written (`.github/workflows/deploy-db.yml`:
`supabase db push` on push to main touching `supabase/migrations/**`).

## Why GitHub Actions db push (not Supabase Branching)

Supabase's GitHub integration (Branching) auto-runs migrations on merge, but
it's a Pro-plan feature billed per branch-hour — it breaks the "runs entirely
for free" premise. GitHub Actions + `supabase db push` is the free, no-vendor-
lock equivalent, reusing the CLI already in the repo.

## One-time setup (human — needs real credentials)

1. GitHub repo → Settings → Secrets and variables → Actions, add:
   - `SUPABASE_ACCESS_TOKEN` — from supabase.com/dashboard/account/tokens
   - `SUPABASE_DB_PASSWORD` — the hosted project's DB password
   - `SUPABASE_PROJECT_REF` — the project ref (the `<ref>` in the URL)
   These live only in Actions secrets — the one unavoidable real secret, never
   in the repo.
2. Reconcile the remote migration ledger ONCE locally, because 0001–0003 were
   hand-applied so their objects already exist but the remote ledger is empty:
   - `supabase link --project-ref <ref>`
   - `supabase migration list` — see which are marked applied remotely
   - If remote shows them as NOT applied (ledger empty), mark them applied
     without re-running the SQL: `supabase migration repair --status applied 0001 0002 0003`
   - `supabase db push` — should now report nothing to do (ledger matches reality)
   After this, CI handles every future migration cleanly.

## Caveat

GitHub DB-push and Vercel frontend-deploy fire independently on merge — a small
window where one lands first. Harmless for additive migrations; sequence
deliberately for a breaking change.
