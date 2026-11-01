import { test, expect } from "@playwright/test";
import { LOCAL_SUPABASE_URL, LOCAL_SECRET_KEY } from "./env";

// R-002 verified automatically: drive the full grade cycle in the browser, then
// assert the observation row landed in the DB — the thing we used to hand-check.
test("grading an item writes a complete reviews observation row", async ({ page }) => {
  await page.goto("/");

  // Curriculum list -> start review.
  await page.getByRole("button", { name: "Demo Deck" }).click();

  // Reveal -> grade.
  await page.getByRole("button", { name: "Reveal" }).click();
  await page.getByRole("button", { name: "Good" }).click();

  // UI reaches done.
  await expect(page.getByText(/Done — reviewed/)).toBeVisible();

  // Direct data assertion via PostgREST with the secret key (bypasses RLS to read
  // ground truth). Plain fetch — no supabase-js, so no Node WebSocket dependency.
  const res = await fetch(
    `${LOCAL_SUPABASE_URL}/rest/v1/reviews?select=strategy,predicted_recall,actual_recall,latency_ms,next_due&order=reviewed_at.desc&limit=1`,
    { headers: { apikey: LOCAL_SECRET_KEY, Authorization: `Bearer ${LOCAL_SECRET_KEY}` } },
  );
  expect(res.ok).toBe(true);
  const rows = (await res.json()) as any[];
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.strategy).toBe("stub-fixed");
  expect(row.next_due).not.toBeNull();
  expect(row.latency_ms).toBeGreaterThanOrEqual(0);
});
