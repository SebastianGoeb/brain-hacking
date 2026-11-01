---
inclusion: always
---

# Brain Hacking — read before working

The full governance is inlined below (not just linked), so it is in context
automatically every session. Two layers: a portable team charter and this
project's constitution. They are authoritative — if a request conflicts, say
so and change the principle in a commit, or decline the drift.

## Propagate to subagents

Subagents do NOT inherit this steering. When dispatching ANY subagent, copy the
two principle sets below (or the relevant rules) into its prompt, and tell it
the flow is requirement → test → app. Never let a subagent work without them.

## Working rules (quick reference)

1. Flow is requirement → test → app. Every unit of work maps to an `R-NNN` file
   in `docs/requirements/`; write/extend the e2e test before the app code. If a
   test and a requirement disagree, the requirement wins — edit the `R-NNN` file
   in the same change. Keep `docs/requirements/README.md` current.
2. Never regress the two spine invariants: strategies stay pluggable behind an
   interface, and every review writes a full observation row.
3. Verify user-facing changes with `npm run test:e2e` (R-009) against a
   disposable local DB — don't hand-check a live database. Needs Docker +
   `supabase start`.
4. Experimentation platform, not just a flashcard app — the user is the test
   subject. Keep anything we might compare swappable, not hardcoded.
5. Static SPA, no SSR, Supabase free tier, publishable key + RLS, platform over
   dependencies.

---

# Meta-principles (portable team charter)

#[[file:docs/meta-principles.md]]

---

# Project principles (Brain Hacking)

#[[file:docs/principles.md]]
