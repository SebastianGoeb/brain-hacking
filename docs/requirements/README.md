# Requirements

One file per requirement. Flat IDs in the filename (`R-NNN-short-slug.md`).
Greppable, diffable, one-file-per-change so automation appends instead of
editing a shared file. The index below is the only shared file — keep it sorted.

## Format

Each requirement file is:

```markdown
# R-NNN Title — <status>

Why: one or two sentences. The reason this exists. No reason → not a requirement.
Done when: a testable condition. If you can't test it, it's not done-able.

(optional) Notes / open questions / links to other R-ids.
```

**Status** is one of:

- `📋 todo` — agreed, not started
- `🔨 building` — in progress
- `✅ done` — shipped and the "Done when" holds
- `💤 deferred` — intentionally not now; recorded so the intent isn't lost
- `❌ dropped` — decided against; kept for the record, with a reason

IDs are permanent. Never renumber. Dropped is a status, not a deletion.

## Index

| ID | Title | Status |
|------|-------------------------------------------|---------------|
| R-001 | Curriculum data model | ✅ done |
| R-002 | Review player + pluggable scheduler | ✅ done |
| R-003 | YAML seed import script | 💤 deferred |
| R-004 | FSRS scheduler implementation | 💤 deferred |
| R-005 | Strategy A/B partitioning + comparison | 💤 deferred |
| R-006 | Motivation strategies (dashboard/levels) | 💤 deferred |
| R-007 | Intentional curriculum ordering design | 💤 deferred |
| R-008 | OAuth federation + link anon identity | 💤 deferred |
| R-009 | Automated e2e verification (local Supabase) | ✅ done |
| R-010 | Principles auto-load + shared home | 🔨 partial |
| R-011 | Deploy schema/migrations to hosted DB | 💤 deferred |
