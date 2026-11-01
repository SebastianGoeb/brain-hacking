# R-013 In-app curriculum editor — 💤 deferred

Why: the real authoring surface. Create/edit curricula and items in the app
(not SQL, not YAML). Supersedes R-003.

Done when: a signed-in owner can create a curriculum, add/edit/reorder items
(prompt, answer, meta), toggle public, and review it — all in the UI, writing
through the existing RLS policies (curricula_write_own / items_write_own).

Notes: needs real auth ownership (anon users can own rows, but OAuth — R-008 —
makes an editor durable across devices). Ordering UI connects to R-007. Build
after there's a reason to author more than demo content.
