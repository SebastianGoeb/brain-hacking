# R-008 OAuth federation (GitHub/Google) + link anon identity — 💤 deferred

Why: anonymous sign-in (R-002) is per-browser — clear storage and the user is
new, and data can't follow to a second device. OAuth gives a real, cross-device
account. Supabase supports Google/GitHub/etc. from a static SPA via redirect
flow (no server).

Done when: user can sign in with GitHub (and/or Google), and an existing
anonymous user can *link* the OAuth identity so their `uid` and all `reviews`
rows carry over (no data loss on upgrade).

Notes: each provider needs an OAuth app registered on the provider side +
credentials pasted into Supabase Auth → Providers. ~10 min for GitHub. Build
when cross-device or a real account is actually wanted — not before.
