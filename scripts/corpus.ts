// Shared CSV <-> records core for the corpus round-trip (R-003). Pure functions,
// no DB — unit-tested. RFC-4180 via csv-parse/csv-stringify (handles CJK,
// commas, quotes, newlines in snippets).
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export type ItemRow = {
  position: number;
  prompt: string;
  answer: string;
  meta: Record<string, unknown>;
};

const COLUMNS = ["position", "prompt", "answer", "meta_json"] as const;

/** Parse a <slug>.csv into item records. Throws loudly with the row on bad data. */
export function parseItems(csv: string): ItemRow[] {
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const seen = new Set<number>();
  return records.map((r, i) => {
    const line = i + 2; // +1 header, +1 to 1-base
    const position = Number(r.position);
    if (!Number.isInteger(position)) {
      throw new Error(`corpus: line ${line}: position must be an integer, got "${r.position}"`);
    }
    if (seen.has(position)) {
      throw new Error(`corpus: line ${line}: duplicate position ${position}`);
    }
    seen.add(position);
    if (!r.prompt || !r.answer) {
      throw new Error(`corpus: line ${line}: prompt and answer are required`);
    }
    let meta: Record<string, unknown> = {};
    if (r.meta_json && r.meta_json !== "{}") {
      try {
        meta = JSON.parse(r.meta_json);
      } catch {
        throw new Error(`corpus: line ${line}: meta_json is not valid JSON: ${r.meta_json}`);
      }
    }
    return { position, prompt: r.prompt, answer: r.answer, meta };
  });
}

/** Serialize records to CSV. Deterministic: sorted by position, stable columns. */
export function serializeItems(items: ItemRow[]): string {
  const rows = [...items]
    .sort((a, b) => a.position - b.position)
    .map((it) => ({
      position: String(it.position),
      prompt: it.prompt,
      answer: it.answer,
      meta_json: Object.keys(it.meta).length ? JSON.stringify(it.meta) : "{}",
    }));
  return stringify(rows, { header: true, columns: COLUMNS as unknown as string[] });
}
