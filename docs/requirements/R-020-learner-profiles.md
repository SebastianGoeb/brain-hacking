# R-020 Multiple learner profiles / separate progress per learner — 💤 deferred

Why: kids share a parent's device/account but need their *own* review history,
and shouldn't see adult translation decks. Surfaced by R-019 (kids mode).

Done when: one account can hold multiple learner profiles, each with isolated
review history (reviews scoped per profile, not just per auth user), and a
profile sees only its appropriate curricula.

Notes: interacts with R-008 (OAuth/identity) and RLS (`reviews.reviewer` becomes
reviewer+profile, or a profile table). Could be as light as "profiles under one
account" or as heavy as separate logins. Decide when kids mode (R-019) is real.
