# Principles — the constitution

These are the meta-requirements: the rules that outlive any single feature.
Read this file first, every session. When a decision conflicts with a feature
request, the principle wins or the principle changes — explicitly, in a commit —
never silently.

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
   branch in the core.

4. **Every review is a logged observation.** A review records which item, which
   strategy produced it, predicted recall vs. actual, latency, and timestamp —
   not just "next due." The log is the experiment's raw data. Get it right once;
   analysis is just queries later.

5. **Intentional curriculum structure.** Curricula express designed sequence,
   prerequisites, and deliberate spacing/interleaving to exploit repetition
   effects. "N a day in random order" (the Anki/HSK anti-pattern) is *one*
   optional mode, never the default and never the only one.

6. **No SSR, no paid infra.** Static SPA, free hosting, Supabase free tier.
   Browser talks to the DB directly; Row-Level Security is the gatekeeper. If a
   feature seems to need a server, find the no-server version first.

7. **Platform over dependency.** Reach for the standard library and native
   platform features before adding a package. New dependency needs a reason a
   few lines of code can't cover.

8. **No feature without an R-id.** Every unit of work maps to a requirement file
   in `docs/requirements/`. No orphan features; no requirement without a reason
   ("Why") and a testable "Done when."

9. **Build the spine, defer the rest.** Record ambition in requirement files
   (even deferred ones) so intent isn't lost — but build the minimum that keeps
   every deferred requirement *reachable without a rewrite*. The two spine
   invariants that must never regress: strategies are pluggable (rule 3) and
   every review is logged as an observation (rule 4).

## Changing these rules

Principles change by editing this file in a commit that says why. That's the
whole process. The friction is deliberate: it's what stops context-rot.
