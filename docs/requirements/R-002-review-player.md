# R-002 Review player + pluggable scheduler — ✅ done

Why: the core learning loop — show prompt, grade recall, schedule next. The
scheduler must be an interface from day one so FSRS/SM-2/custom/fixed-order are
swappable (principle 3), and every review must write an observation (principle 4).

Done when: reviewing an item shows prompt → reveals answer → records a grade,
writes a full `reviews` row (including `strategy`, predicted/actual, latency),
and the next due time comes from a `Scheduler` interface whose first impl can be
a 5-line stub. ✅ verified: grading the demo item wrote a `reviews` row with
`strategy='stub-fixed'` and a scheduler-computed `next_due`.

Auth: `reviews` is RLS-scoped to `auth.uid()`, so the player signs in via
anonymous auth (`ensureUser`). Requires "Anonymous sign-ins" enabled in the
Supabase dashboard. OAuth upgrade is R-008.

Spine invariant: even the stub scheduler goes behind the interface, and even the
first review writes a complete observation row. Do not shortcut either.
