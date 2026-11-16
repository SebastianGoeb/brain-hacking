// Thin PostgREST client for scripts — plain fetch, no supabase-js (avoids the
// Node WebSocket dependency its realtime client pulls in). Secret key bypasses
// RLS to upsert/read any curriculum. Keys read at runtime, never hardcoded:
//   SUPABASE_URL, SUPABASE_SECRET_KEY  (see `supabase status -o env` for local)
function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY (see `supabase status -o env`).");
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function rest(path: string, init: RequestInit = {}): Promise<any> {
  const { url, key } = cfg();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PostgREST ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

export async function curriculumIdBySlug(slug: string): Promise<string> {
  const rows = await rest(`curricula?slug=eq.${encodeURIComponent(slug)}&select=id`);
  if (!rows?.length) throw new Error(`curriculum "${slug}" not found — create it in curricula first`);
  return rows[0].id;
}

export async function upsertItems(rows: Record<string, unknown>[]): Promise<void> {
  await rest("items?on_conflict=curriculum_id,position", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
}

export async function selectItems(curriculumId: string): Promise<any[]> {
  return rest(
    `items?curriculum_id=eq.${curriculumId}&select=position,prompt,answer,meta&order=position`,
  );
}
