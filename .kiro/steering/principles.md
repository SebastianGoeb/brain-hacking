---
inclusion: always
---

# Brain Hacking — read before working

This project has a constitution at `docs/principles.md` and per-requirement
files in `docs/requirements/`. Before building anything:

1. Read `docs/principles.md`. It is authoritative. If a request conflicts with
   it, say so — change the principle explicitly or decline the drift.
2. Every unit of work maps to an `R-NNN` file. No feature without one. Update
   the requirement's status and the index in `docs/requirements/README.md`.
3. Never regress the two spine invariants: strategies stay pluggable behind an
   interface, and every review writes a full observation row.
4. This is an experimentation platform, not just a flashcard app — the user is
   the test subject. Keep anything we might compare swappable, not hardcoded.
5. Static SPA, no SSR, Supabase free tier, platform over dependencies.

Build the spine; defer the rest into requirement files so intent isn't lost.
