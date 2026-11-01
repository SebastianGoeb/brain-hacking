# R-003 YAML seed import script — ❌ dropped

Why dropped: the real authoring story is an in-app editor (R-013), which
supersedes a YAML pipeline. Building a YAML→DB script now would be speculative
infrastructure for a need the editor replaces (meta-principle 4 / YAGNI).

What we did instead: a richer demo curriculum as plain SQL
(`supabase/demo-curriculum.sql`) applied to the hosted DB by hand — enough
content to exercise the review loop on the live site, no new machinery. Made
item seeds idempotent via a `(curriculum_id, position)` unique constraint
(migration 0002).

Revisit only if version-controlled, file-authored curricula become a real need
*separate from* the editor.
