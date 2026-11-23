import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
 testDir: "./applications/app/e2e",
 fullyParallel: true,
 reporter: "list",
 use: {
  baseURL: "http://localhost:5173",
  trace: "retain-on-failure",
 },
 projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
 webServer: {
  command: "npm run app",
  url: "http://localhost:5173/register",
  reuseExistingServer: true,
 },
});
