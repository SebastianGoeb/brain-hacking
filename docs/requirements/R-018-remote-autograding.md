# R-018 Remote auto-grading (CS50-style) — 💤 deferred / likely out-of-core

Why: learn-by-doing where a submission is graded by a real harness (CS50
connects a GitHub App; an Action grades a submitted branch/PR and the result
flows back). Compelling for programming, but it *executes untrusted code* — a
backend/sandbox.

Done when: (if ever) a submission is graded by an external runner and the result
is recorded as a review outcome.

Notes: this breaks the hard "no SSR / static SPA + Supabase" constraint — it's a
server-ful subsystem. Likely a separate product or a far-future requirement that
explicitly accepts leaving the free-static world. Recorded so nobody tries to
cram a code sandbox into the SPA. Client-side interactive grading (R-017) is the
in-core alternative for most needs.
