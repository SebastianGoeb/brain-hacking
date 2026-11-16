// Export a curriculum's items from the DB to CSV (R-003). Deterministic.
// Usage: tsx scripts/export.ts <slug> [content/<slug>.csv]
import { writeFileSync } from "node:fs";
import { serializeItems, type ItemRow } from "./corpus";
import { curriculumIdBySlug, selectItems } from "./db";

async function main() {
  const slug = process.argv[2];
  const path = process.argv[3] ?? `content/${slug}.csv`;
  if (!slug) throw new Error("usage: tsx scripts/export.ts <slug> [csv-path]");

  const curriculumId = await curriculumIdBySlug(slug);
  const data = await selectItems(curriculumId);

  const items: ItemRow[] = (data ?? []).map((r: any) => ({
    position: r.position,
    prompt: r.prompt,
    answer: r.answer,
    meta: r.meta ?? {},
  }));
  writeFileSync(path, serializeItems(items));
  console.log(`exported ${items.length} items from "${slug}" -> ${path}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
