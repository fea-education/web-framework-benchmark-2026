import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
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

export default function FilterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set()
  );
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`/api/products`);
        const json = (await res.json()) as ApiResponse<Product[]>;
        setProducts(json.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadProducts();
  }, []);

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) {
        return false;
      }
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
  }, [products, selectedCategories, maxPrice, minRating]);

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">
        Filter Products
      </h1>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 space-y-6">
            {/* Category filter */}
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Category
              </h2>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-brand-600"
                    />
                    <span className="text-sm text-neutral-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Max Price: ${maxPrice}
              </h2>
              <input
                type="range"
                min={0}
                max={maxProductPrice}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>$0</span>
                <span>${maxProductPrice}</span>
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Min Rating: {minRating.toFixed(1)} ★
              </h2>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Any</span>
                <span>5★</span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSelectedCategories(new Set());
                setMaxPrice(maxProductPrice);
                setMinRating(0);
              }}
              className="w-full text-sm font-medium text-brand-600 border border-brand-300 px-4 py-2 rounded-[var(--radius-button)] hover:bg-brand-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-neutral-500">Loading products…</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-neutral-500 mb-4">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}{" "}
                found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <article
                    key={product.id}
                    className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow overflow-hidden flex flex-col"
                  >
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="aspect-square bg-neutral-100 overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">
                        {product.category}
                      </span>
                      <h2 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-2 flex-1">
                        <Link href={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-warning text-sm">
                          {"★".repeat(Math.round(product.rating))}
                          {"☆".repeat(5 - Math.round(product.rating))}
                        </span>
                        <span className="text-xs text-neutral-500">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
                        <span className="text-lg font-bold text-neutral-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-xs font-medium bg-brand-600 text-white px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-brand-700 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
