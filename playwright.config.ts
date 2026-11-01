import { defineConfig, devices } from "@playwright/test";
import { LOCAL_SUPABASE_URL, LOCAL_PUBLISHABLE_KEY } from "./e2e/env";

// Runs the app against local Supabase (`supabase start` must be up).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: { baseURL: "http://localhost:5173", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: LOCAL_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: LOCAL_PUBLISHABLE_KEY,
    },
  },
});
