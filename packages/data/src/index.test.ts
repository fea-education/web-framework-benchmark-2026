import { describe, it, expect } from "vitest";
import { products } from "./index.js";
import type { Category } from "./types.js";

const EXPECTED_CATEGORIES: Category[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food & Beverage",
  "Beauty",
];

const PICSUM_URL_PATTERN = /^https:\/\/picsum\.photos\/seed\/product-\d+\/400\/300$/;

describe("products fixture", () => {
  it("contains exactly 100 products", () => {
    expect(products).toHaveLength(100);
  });

  it("all products conform to the Product type (all required fields present)", () => {
    for (const product of products) {
      expect(typeof product.id).toBe("number");
      expect(typeof product.name).toBe("string");
      expect(product.name.length).toBeGreaterThan(0);
      expect(typeof product.description).toBe("string");
      expect(product.description.length).toBeGreaterThan(0);
      expect(typeof product.price).toBe("number");
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.category).toBe("string");
      expect(EXPECTED_CATEGORIES).toContain(product.category);
      expect(typeof product.stock).toBe("number");
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(typeof product.rating).toBe("number");
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(typeof product.image_url).toBe("string");
      expect(Array.isArray(product.tags)).toBe(true);
    }
  });

  it("all 8 categories are referenced by at least one product", () => {
    const presentCategories = new Set(products.map((p) => p.category));
    for (const category of EXPECTED_CATEGORIES) {
      expect(presentCategories.has(category)).toBe(true);
    }
  });

  it("all image_url values match the picsum.photos URL pattern", () => {
    for (const product of products) {
      expect(product.image_url).toMatch(PICSUM_URL_PATTERN);
    }
  });
});
