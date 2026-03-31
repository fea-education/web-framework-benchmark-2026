import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { products } from "@benchmark/data";
import type { Product, Category, ApiResponse } from "@benchmark/data";

const CATEGORIES: Category[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food & Beverage",
  "Beauty",
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLatencyMs(): number {
  const val = process.env["LATENCY_MS"];
  if (!val) return 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function createApp(): Hono {
  const app = new Hono();

  app.get("/health", (c) => {
    return c.json({ status: "ok" });
  });

  app.get("/products", async (c) => {
    const latency = getLatencyMs();
    if (latency > 0) await delay(latency);

    const response: ApiResponse<Product[]> = {
      data: products,
      total: products.length,
    };
    return c.json(response);
  });

  app.get("/products/:id", async (c) => {
    const latency = getLatencyMs();
    if (latency > 0) await delay(latency);

    const id = parseInt(c.req.param("id"), 10);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return c.json({ success: false, error: "Not found" }, 404);
    }

    const response: ApiResponse<Product> = { data: product };
    return c.json(response);
  });

  app.get("/categories", async (c) => {
    const latency = getLatencyMs();
    if (latency > 0) await delay(latency);

    const response: ApiResponse<Category[]> = {
      data: CATEGORIES,
      total: CATEGORIES.length,
    };
    return c.json(response);
  });

  return app;
}

const PORT = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3000;

if (process.argv[1] && !process.argv[1].endsWith(".test.js")) {
  const app = createApp();
  serve({ fetch: app.fetch, port: PORT }, () => {
    console.log(`API server running on port ${PORT}`);
  });
}
