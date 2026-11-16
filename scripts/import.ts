// Import a curriculum CSV into the DB (R-003). Idempotent upsert.
// Usage: tsx scripts/import.ts <slug> [content/<slug>.csv]
import { readFileSync } from "node:fs";
import { parseItems } from "./corpus";
import { curriculumIdBySlug, upsertItems } from "./db";

async function main() {
  const slug = process.argv[2];
  const path = process.argv[3] ?? `content/${slug}.csv`;
  if (!slug) throw new Error("usage: tsx scripts/import.ts <slug> [csv-path]");

  const items = parseItems(readFileSync(path, "utf8"));
  const curriculumId = await curriculumIdBySlug(slug);

  const rows = items.map((it) => ({
    curriculum_id: curriculumId,
    position: it.position,
    prompt: it.prompt,
    answer: it.answer,
    meta: it.meta,
  }));
  await upsertItems(rows);
  console.log(`imported ${rows.length} items into "${slug}"`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
