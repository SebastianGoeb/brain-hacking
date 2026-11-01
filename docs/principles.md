# Project principles — Brain Hacking

Project-specific. Builds on `docs/meta-principles.md` (the portable team
charter) and never contradicts it. Read both, every session; meta first.

## What this project is

Brain Hacking is **an experimentation platform where the user is the test
subject.** The learning app (flashcards, review, curricula) is the *apparatus*.
The point is to compare learning strategies — scheduling, ordering, motivation —
on oneself, with real logged data.

Every design choice serves that: keep strategies swappable, log every
observation, never hardcode the thing we want to compare.

## The rules

1. **Subject-agnostic core.** The engine knows nothing about chess, Chinese, or
   any topic. Subjects are *data*, not code. Subject-specific data lives in a
   `jsonb` escape hatch, never in new columns or new code paths.

2. **Curriculum is data, not a file format.** Curricula live in the database.
   There is no runtime parser for YAML/CSV/etc. Authoring conveniences (e.g. a
   YAML seed script) write *into* the DB; the app only ever reads the DB.

3. **Strategies are pluggable, never hardcoded.** Scheduling (FSRS, SM-2,
   custom, fixed-order) sits behind one interface: `(item, history) -> next_due`.
   Same for motivation (dashboards, gamification, levels) and item ordering.
   Anything we might want to A/B is an implementation behind an interface, not a
   branch in the core. *(Spine invariant — never regress.)*

4. **Every review is a logged observation.** A review records which item, which
   strategy produced it, predicted recall vs. actual, latency, and timestamp —
   not just "next due." The log is the experiment's raw data. Get it right once;
   analysis is just queries later. *(Spine invariant — never regress.)*

5. **Intentional curriculum structure.** Curricula express designed sequence,
   prerequisites, and deliberate spacing/interleaving to exploit repetition
   effects. "N a day in random order" (the Anki/HSK anti-pattern) is *one*
   optional mode, never the default and never the only one.

6. **No SSR, no paid infra.** Static SPA, free hosting, Supabase free tier.
   Browser talks to the DB directly with the publishable key; Row-Level Security
   is the gatekeeper. If a feature seems to need a server, find the no-server
   version first.

## How the team flow binds to this stack

Meta-principle 2 (requirement → test → app) is realized here with **Playwright
e2e against a disposable local Supabase** (R-009):

- Every unit of work is an `R-NNN` file in `docs/requirements/` with a reason
  and a testable "Done when"; the index in that folder's README stays current.
- A behavioral change is encoded as an e2e test *before* the app code, and is
  unfinished until `npm run test:e2e` passes. No hand-checking a live DB.
- If a test and its requirement disagree, the requirement wins; changing a
  test's expected behavior means editing its `R-NNN` file in the same change.
- The two spine invariants above (rules 3 and 4) must survive every change.
