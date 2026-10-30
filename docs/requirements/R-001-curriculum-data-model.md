# R-001 Curriculum data model — ✅ done

Why: the whole platform is subject-agnostic, so the data model — not code — has
to carry subjects, curriculum structure, and experiment logging. Get the shape
right and every later requirement is reachable without a schema rewrite.

Done when: `supabase/schema.sql` creates the tables below with RLS enabled, the
anon/authenticated roles can only touch their own rows, and the app can read a
public curriculum's items from the browser with the anon key. ✅ verified: a
public curriculum renders in the browser via the anon/publishable key.

## Supabase setup (not captured by schema.sql — dashboard state)

Running `schema.sql` is not enough. The Data API must also expose the tables,
or every request fails with a misleading `Invalid API key` (not a 401/404):

1. Settings → API → Data API: expose the `public` schema.
2. **Also expose each table** (`curricula`, `items`, `reviews`) explicitly —
   schema exposure alone is not sufficient on current projects.

RLS still gatekeeps; exposing a table only lets requests reach the RLS layer.

## Tables

- `curricula (id, slug, title, subject, description, is_public, owner, created_at)`
- `items (id, curriculum_id, position, prompt, answer, media_url, meta jsonb, prereq_ids)`
- `reviews (id, item_id, reviewer, strategy, predicted_recall, actual_recall, latency_ms, reviewed_at, next_due)`

Notes:
- `items.meta jsonb` is the subject escape hatch (FEN for chess, pinyin/audio for
  Chinese). No per-subject columns — principle 1.
- `items.position` + `items.prereq_ids` carry intentional ordering/prerequisites
  (principle 5). Design of *how* to use them is R-007.
- `reviews` is the observation log (principle 4): `strategy`, `predicted_recall`
  vs `actual_recall`, `latency_ms`. This is what makes R-004/R-005 possible later.
- Media goes in Supabase Storage; `items.media_url` references it.
