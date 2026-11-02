# R-016 Concept-reference seam (to the sibling concept collection) — 💤 deferred

Why: the "beautifully illustrated programming concepts" idea is a *separate
product* (authored, animated, read-once — not SRS). The synergy is a reference,
not a merge: a curriculum item (e.g. Rust "ownership") may point at a concept
piece that lives in that sibling project.

Done when: an item can carry `meta.concept_ref` (a stable slug/URL); the player
shows an optional "read the concept" link when present and ignores it otherwise.
No rendering of rich content inside the review engine.

Notes: one-line convention, zero new schema (meta is the escape hatch, principle
1). Build only when the first concept piece exists — rendering a ref before any
target exists is scaffolding for nothing. Protects meta from being misused as
the place animations live.
