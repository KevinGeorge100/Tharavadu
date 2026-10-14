import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";

const repo = path.resolve(__dirname, "..");
const localPython = path.join(repo, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const python = process.env.THAR_PYTHON || (existsSync(localPython) ? localPython : "python");

export default defineConfig({
  testDir: "./e2e", timeout: 60000, expect: { timeout: 10000 },
  fullyParallel: false, workers: 1, retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3010", trace: "retain-on-failure", screenshot: "only-on-failure",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1280, height: 800 } } },
    { name: "laptop", testMatch: /responsive\.spec\.ts$/, use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
    { name: "wide", use: { browserName: "chromium", viewport: { width: 1920, height: 1080 } } },
    { name: "tablet", testMatch: /responsive\.spec\.ts$/, use: { browserName: "chromium", viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: `"${python}" scripts/e2e_backend.py`, cwd: repo, url: "http://127.0.0.1:8010/api/health", reuseExistingServer: false, timeout: 30000 },
    { command: "npm run build && node -e \"require('node:fs').cpSync('.next/static', '.next/standalone/.next/static', { recursive: true })\" && node .next/standalone/server.js", cwd: __dirname,
      env: { API_URL: "http://127.0.0.1:8010", PORT: "3010", HOSTNAME: "127.0.0.1" },
      url: "http://127.0.0.1:3010", reuseExistingServer: false, timeout: 180000 },
  ],
});
