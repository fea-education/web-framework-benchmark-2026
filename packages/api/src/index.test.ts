import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createApp } from "./index.js";
import type { Product, Category, ApiResponse } from "@benchmark/data";

const app = createApp();

async function fetchFromApp(
  path: string,
  env?: Record<string, string>
): Promise<Response> {
  // Set env vars before making request
  if (env) {
    for (const [key, value] of Object.entries(env)) {
      process.env[key] = value;
    }
  }

  const request = new Request(`http://localhost${path}`);
  return app.fetch(request);
}

describe("GET /health", () => {
  it("returns { status: ok } immediately (no latency)", async () => {
    // With LATENCY_MS=500 set, health must still be fast
    process.env["LATENCY_MS"] = "500";
    const start = Date.now();
    const res = await fetchFromApp("/health");
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
    expect(elapsed).toBeLessThan(50);
  });
});

describe("GET /products", () => {
  beforeAll(() => {
    delete process.env["LATENCY_MS"];
  });

  it("returns exactly 100 products", async () => {
    const res = await fetchFromApp("/products");
    expect(res.status).toBe(200);

    const body = (await res.json()) as ApiResponse<Product[]>;
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBe(100);
  });

  it("response shape matches ApiResponse<Product[]>", async () => {
    const res = await fetchFromApp("/products");
    const body = (await res.json()) as ApiResponse<Product[]>;

    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);

    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("price");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("stock");
    expect(first).toHaveProperty("rating");
    expect(first).toHaveProperty("image_url");
    expect(first).toHaveProperty("tags");
  });

  it("delays response by at least LATENCY_MS", async () => {
    process.env["LATENCY_MS"] = "500";
    const start = Date.now();
    const res = await fetchFromApp("/products");
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(500);
    delete process.env["LATENCY_MS"];
  });
});

describe("GET /products/:id", () => {
  beforeAll(() => {
    delete process.env["LATENCY_MS"];
  });

  it("returns a single product for a valid id", async () => {
    const res = await fetchFromApp("/products/1");
    expect(res.status).toBe(200);

    const body = (await res.json()) as ApiResponse<Product>;
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("id", 1);
    expect(body.data).toHaveProperty("name");
  });

  it("returns 404 for unknown id", async () => {
    const res = await fetchFromApp("/products/99999");
    expect(res.status).toBe(404);

    const body = (await res.json()) as { success: false; error: string };
    expect(body).toHaveProperty("error");
    expect(body["success"]).toBe(false);
  });

  it("delays response by at least LATENCY_MS", async () => {
    process.env["LATENCY_MS"] = "500";
    const start = Date.now();
    const res = await fetchFromApp("/products/1");
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(500);
    delete process.env["LATENCY_MS"];
  });
});

describe("GET /categories", () => {
  beforeAll(() => {
    delete process.env["LATENCY_MS"];
  });

  it("returns exactly 8 categories", async () => {
    const res = await fetchFromApp("/categories");
    expect(res.status).toBe(200);

    const body = (await res.json()) as ApiResponse<Category[]>;
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBe(8);
  });

  it("response shape matches ApiResponse<Category[]>", async () => {
    const res = await fetchFromApp("/categories");
    const body = (await res.json()) as ApiResponse<Category[]>;

    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("total", 8);
  });

  it("delays response by at least LATENCY_MS", async () => {
    process.env["LATENCY_MS"] = "500";
    const start = Date.now();
    const res = await fetchFromApp("/categories");
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(500);
    delete process.env["LATENCY_MS"];
  });
});
