"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiResponse, Product, Category } from "@benchmark/data";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3000";

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

type SortKey = "name" | "price-asc" | "price-desc" | "rating";

export default function FilterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set()
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("name");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse<Product[]>;
        setProducts(json.data);
        const prices = json.data.map((p) => p.price);
        setMaxPrice(Math.ceil(Math.max(...prices)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);

  const toggleCategory = useCallback((cat: Category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const filtered = products
    .filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category))
        return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-danger/10 p-6 text-center">
        <p className="text-sm font-medium text-danger">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar Filters */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-surface p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">
            Filters
          </h2>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Category
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-neutral-300 text-brand-600"
                  />
                  <span className="text-sm text-neutral-600">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Price Range
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-neutral-500">
                  Min: ${minPrice}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500">
                  Max: ${maxPrice}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Min Rating */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Min Rating: {minRating.toFixed(1)}
            </h3>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSelectedCategories(new Set());
              setMinPrice(0);
              setMaxPrice(Math.ceil(Math.max(...products.map((p) => p.price))));
              setMinRating(0);
            }}
            className="w-full rounded-[var(--radius-button)] border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-[var(--radius-button)] border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="name">Name (A–Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-[var(--radius-card)] border border-neutral-200 bg-surface">
            <p className="text-sm text-neutral-500">
              No products match your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group block rounded-[var(--radius-card)] border border-neutral-200 bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-neutral-100">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block rounded-[var(--radius-badge)] bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {product.category}
                  </span>
                  <h2 className="mt-2 text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h2>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-neutral-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                      <svg
                        className="h-3.5 w-3.5 text-warning"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
