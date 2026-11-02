# R-021 Media pipeline (bulk upload to Storage) — 💤 deferred

Why: audio/image decks (kids — R-019, illustrated items) need media. Authoring
should stay file-based: a media folder tree in the repo, bulk-uploaded to
Supabase Storage, with CSV rows referencing files by path.

Done when: `content/<slug>/media/**` uploads to Storage and the import (R-003)
rewrites refs (e.g. `mao.mp3` → public URL) into `items.media_url` / `meta`.

Notes: build when the first media deck exists — the text decks (R-003) need
none, so ship text first. Tone-correct Mandarin audio source (R-019) is a
prerequisite for the kids deck specifically.
