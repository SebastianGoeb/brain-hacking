# R-003 CSV-authored corpus + import script — 🔨 building

(Was "YAML seed", dropped; un-dropped and re-scoped to CSV. The in-app editor
R-013 is demoted — for a single technical author who also lets an AI edit the
corpus, file authoring beats a CRUD UI.)

Why: content must be authorable without a UI, in-repo (version-controlled), and
editable by an AI across thousands of entries without getting lost. CSV wins:
one item = one line, line-local edits, trivial bulk append, loud+local failure
on a bad row. YAML/MD-per-item lose this at scale (nesting/indent state, or
8000 files).

Done when: `content/<slug>.csv` (RFC-4180) + a `content/curricula.csv` index
import into the DB via a script. Strict parse — a malformed/duplicate-position
row fails loudly with its line number, never silently misaligns. Upsert on
`curricula.slug` and `(items.curriculum_id, position)` (idempotent; the unique
key from migration 0002). Text-only for now.

## Format

- `content/curricula.csv`: `slug,title,subject,description,is_public`
- `content/<slug>.csv`: `position,prompt,answer` (+ optional `meta_json`
  column added only when a deck first needs nested data — YAGNI until then).
- Rich/long content (explainers, task specs) does NOT go in these files — it
  lives in the sibling concept project, referenced via `meta.concept_ref`
  (R-016). CSV stays dense flashcard rows.

## Build/verify

- Strict RFC-4180 parse via a real CSV lib (not split(',')) — prompts/answers
  contain commas, quotes, CJK, snippets. Fail loud on bad rows.
- Import target local-first (run, verify, then prod) — the script reads keys at
  runtime (like the e2e harness), never hardcoded.
- Unit test: malformed row → clear error; valid → correct parsed rows.
- Media upload is separate — R-021.
