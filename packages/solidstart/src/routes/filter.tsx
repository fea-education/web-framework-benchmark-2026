import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import type { Product, Category, ApiResponse } from "@benchmark/data";

const API_URL = "/api";

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
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedCategory, setSelectedCategory] = createSignal<Category | "">("");
  const [maxPriceFilter, setMaxPriceFilter] = createSignal(1000);
  const [maxPriceBound, setMaxPriceBound] = createSignal(1000);
  const [minRating, setMinRating] = createSignal(0);
  const [sortKey, setSortKey] = createSignal<SortKey>("name");

  onMount(async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResponse<Product[]>;
      setProducts(json.data);
      const prices = json.data.map((p) => p.price);
      const max = Math.ceil(Math.max(...prices));
      setMaxPriceBound(max);
      setMaxPriceFilter(max);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  });

  const filtered = createMemo(() => {
    return products()
      .filter((p) => {
        if (selectedCategory() !== "" && p.category !== selectedCategory()) return false;
        if (p.price > maxPriceFilter()) return false;
        if (p.rating < minRating()) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortKey()) {
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
  });

  const resetFilters = () => {
    setSelectedCategory("");
    setMaxPriceFilter(maxPriceBound());
    setMinRating(0);
    setSortKey("name");
  };

  return (
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Filter Products</h1>
      <Show
        when={!loading()}
        fallback={
          <div class="flex h-64 items-center justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        }
      >
        <Show when={!error()} fallback={
          <div class="rounded-lg bg-red-50 p-6 text-center">
            <p class="text-sm font-medium text-red-600">Error: {error()}</p>
          </div>
        }>
          <div class="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar filters */}
            <aside class="w-full shrink-0 lg:w-64">
              <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 class="text-base font-semibold text-gray-900 mb-4">Filters</h2>

                {/* Category select — role="combobox" for test F3/F4 */}
                <div class="mb-6">
                  <label class="text-sm font-medium text-gray-700 mb-2 block" for="category-select">
                    Category
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory()}
                    onChange={(e) => setSelectedCategory(e.currentTarget.value as Category | "")}
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <For each={CATEGORIES}>
                      {(cat) => <option value={cat}>{cat}</option>}
                    </For>
                  </select>
                </div>

                {/* Price Range — max price first (F6: fill "0" hides all products) */}
                <div class="mb-6">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">Max Price: ${maxPriceFilter()}</h3>
                  <input
                    type="range"
                    min={0}
                    max={maxPriceBound()}
                    value={maxPriceFilter()}
                    onInput={(e) => setMaxPriceFilter(Number(e.currentTarget.value))}
                    class="w-full accent-blue-600"
                  />
                  <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$0</span>
                    <span>${maxPriceBound()}</span>
                  </div>
                </div>

                {/* Min Rating */}
                <div class="mb-6">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Min Rating: {minRating().toFixed(1)}
                  </h3>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={minRating()}
                    onInput={(e) => setMinRating(Number(e.currentTarget.value))}
                    class="w-full accent-blue-600"
                  />
                  <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Results */}
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-gray-500">
                  {filtered().length} result{filtered().length !== 1 ? "s" : ""}
                </p>
                <select
                  value={sortKey()}
                  onChange={(e) => setSortKey(e.currentTarget.value as SortKey)}
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name (A–Z)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <Show
                when={filtered().length > 0}
                fallback={
                  <div class="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
                    <p class="text-sm text-gray-500">No products match your filters.</p>
                  </div>
                }
              >
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <For each={filtered()}>
                    {(product) => (
                      <article role="article">
                        <a
                          href={`/products/${product.id}`}
                          class="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                        >
                          <img
                            src={product.image_url}
                            alt={product.name}
                            width={400}
                            height={300}
                            class="w-full h-40 object-cover"
                            loading="lazy"
                          />
                          <div class="p-4">
                            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              {product.category}
                            </span>
                            <h2 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">
                              {product.name}
                            </h2>
                            <div class="mt-2 flex items-center justify-between">
                              <span class="text-base font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                              </span>
                              <span class="text-sm text-gray-500">
                                ★ {product.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </a>
                      </article>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
