# R-003 YAML seed import script — 💤 deferred

Why: hand-authoring curricula as DB rows gets tedious. A YAML file + seed script
is a nicer authoring surface — but it stays a build-time convenience, never a
runtime feature (principle 2).

Done when: `scripts/seed.ts` reads a YAML curriculum and upserts it into the DB.
The app never reads YAML; it only ever reads the DB.

Add when: authoring directly in the DB actually annoys. Not before.
