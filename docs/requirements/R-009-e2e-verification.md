# R-009 Automated e2e verification (local Supabase + Playwright) — ✅ done

Why: the AI (and the human) should verify its own work, not hand-check a live
DB. This is the point of the project-as-AI-tooling-experiment: changes are
proven by a repeatable, self-contained test, not by eyeballing.

Done when: `npm run test:e2e` spins up a disposable local DB, seeds it, drives
the real browser through the review loop, and asserts the resulting `reviews`
row in Postgres — no live project, no manual steps. ✅ verified: test passes.

## How it works

- `supabase/config.toml` + `migrations/0001_init.sql` + `seed.sql`: `supabase
  start`/`db reset` builds a clean local stack with the demo curriculum and
  anonymous sign-ins enabled (mirrors the dashboard toggle, so local is
  self-contained — no manual config).
- `pretest:e2e` runs `supabase db reset` so each run starts clean.
- `playwright.config.ts` injects the fixed local Supabase URL + publishable key
  and starts the Vite dev server itself.
- `e2e/review.spec.ts` drives the grade cycle, then asserts the observation row
  via PostgREST with the local secret key (bypasses RLS to read ground truth;
  plain `fetch`, no supabase-js, to avoid the Node WebSocket dependency).

Local-dev keys in `e2e/env.ts` are Supabase's fixed defaults, identical on every
machine — not secrets, committed deliberately so the harness is reproducible.

Prereq: Docker running + the `supabase` CLI dev dependency (both in repo).
