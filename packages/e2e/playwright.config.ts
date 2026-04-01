import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "off",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "nextjs-app",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_NEXTJS_APP"] ?? "http://localhost:3001",
      },
    },
    {
      name: "nextjs-pages",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_NEXTJS_PAGES"] ?? "http://localhost:3002",
      },
    },
    {
      name: "sveltekit",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_SVELTEKIT"] ?? "http://localhost:3003",
      },
    },
    {
      name: "nuxt",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env["APP_BASE_NUXT"] ?? "http://localhost:3004",
      },
    },
    {
      name: "astro-vanilla",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_ASTRO_VANILLA"] ?? "http://localhost:3005",
      },
    },
    {
      name: "astro-solid",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_ASTRO_SOLID"] ?? "http://localhost:3006",
      },
    },
    {
      name: "qwik",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env["APP_BASE_QWIK"] ?? "http://localhost:3007",
      },
    },
    {
      name: "solidstart",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env["APP_BASE_SOLIDSTART"] ?? "http://localhost:3008",
      },
    },
  ],
});
