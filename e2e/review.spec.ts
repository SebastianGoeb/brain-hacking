import { test, expect } from "@playwright/test";
import { LOCAL_SUPABASE_URL, LOCAL_SECRET_KEY } from "./env";

const db = (path: string) =>
  fetch(`${LOCAL_SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: LOCAL_SECRET_KEY, Authorization: `Bearer ${LOCAL_SECRET_KEY}` },
  });

// R-002 + R-004 verified automatically: drive the real grade cycle in the
// browser, assert the observation rows in Postgres (R-002), and assert the due
// queue empties as SM-2 pushes next_due into the future (R-004).
test("review loop writes sm2 observations and due-filters the queue", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Demo Deck" }).click();

  // Two seeded items are due; grade both.
  await expect(page.getByText("1 / 2")).toBeVisible();
  await page.getByRole("button", { name: "Reveal" }).click();
  await page.getByRole("button", { name: "Good" }).click();
  await page.getByRole("button", { name: "Reveal" }).click();
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByText(/Done — reviewed 2/)).toBeVisible();

  // R-002: complete observation rows, strategy now sm2.
  const rows = (await (await db(
    "reviews?select=strategy,predicted_recall,actual_recall,latency_ms,next_due&order=reviewed_at.desc",
  )).json()) as any[];
  expect(rows.length).toBe(2);
  for (const r of rows) {
    expect(r.strategy).toBe("sm2");
    expect(r.next_due).not.toBeNull();
    expect(r.latency_ms).toBeGreaterThanOrEqual(0);
    expect(new Date(r.next_due).getTime()).toBeGreaterThan(Date.now()); // pushed into the future
  }

  // R-004: both items now have future next_due, so the queue is empty on reload.
  await page.reload();
  await page.getByRole("button", { name: "Demo Deck" }).click();
  await expect(page.getByText(/Nothing due right now/)).toBeVisible();
});
