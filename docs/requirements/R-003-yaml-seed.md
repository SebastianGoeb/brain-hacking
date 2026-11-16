# R-003 CSV corpus round-trip (import + export) — ✅ done

(Was "YAML seed", dropped; un-dropped, re-scoped to CSV, then to a round-trip.)

Why: content is authored/edited as CSV (one item = one line, AI-editable at
scale), but the DB is what the app reads (principle 2). Both directions are
needed: seed/edit a CSV into the DB (import) and pull the DB back to a CSV for
editing (export). Upstream (drkameleon HSK) is a one-time *seed*, never a live
dependency — manual edits must persist, so regeneration from source is out.

Done when: ✅
- `scripts/import.ts`: our CSV → DB. Strict RFC-4180 parse; malformed/duplicate-
  position/invalid-meta row fails loudly with its line. Idempotent upsert on
  `(items.curriculum_id, position)`.
- `scripts/export.ts`: DB → our CSV. Deterministic (sorted by position, stable
  columns) so DB→CSV→DB is churn-free.
- Round-trip is identity: records → CSV → records (unit test); and verified
  end-to-end against a real DB (import → export → byte-identical CSV).

## Format

- `content/curricula.csv`: `slug,title,subject,description,is_public`
- `content/<slug>.csv`: `position,prompt,answer,meta_json` (meta_json a JSON
  cell; `{}` when unused). Rich/long content stays in the sibling concept
  project via `meta.concept_ref` (R-016), not in these files.

## Canonical source: deferred, zero-cost to flip

DB-as-truth vs git-CSV-as-truth is NOT decided. Both use the same import+export
scripts; the only difference is which direction runs more and whether the CSV is
committed. Start with `content/*.csv` **gitignored** (DB is truth, CSV is a
scratch/edit surface). Committing it later (for content versioning/review) is a
one-line `.gitignore` change, no code change.

## Notes

- Strict parse via `csv-parse`/`csv-stringify` (RFC-4180: CJK, commas, quotes,
  snippets) — not `split(',')`.
- Scripts read Supabase keys at runtime (like the e2e harness), never hardcoded.
  Local-first: import to local, verify, then prod.
- Seeding the first HSK CSV from drkameleon is a one-off `convert-hsk.ts` — glue,
  not part of this requirement's contract.
- Media upload is separate — R-021.
