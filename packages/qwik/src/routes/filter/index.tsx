import { component$, useSignal, useComputed$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { ApiResponse, Product, Category } from '@benchmark/data';
import { Link } from '@builder.io/qwik-city';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const ALL_CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Food & Beverage',
  'Beauty',
];

export const useAllProducts = routeLoader$(async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) return [] as Product[];
    const json = (await res.json()) as ApiResponse<Product[]>;
    return json.data;
  } catch {
    return [] as Product[];
  }
});

export default component$(() => {
  const allProducts = useAllProducts();

  const selectedCategory = useSignal<Category | ''>('');
  const minPrice = useSignal<number>(0);
  const maxPrice = useSignal<number>(10000);
  const minRating = useSignal<number>(0);

  const filtered = useComputed$(() => {
    return allProducts.value.filter((p) => {
      if (selectedCategory.value && p.category !== selectedCategory.value) return false;
      if (p.price < minPrice.value) return false;
      if (maxPrice.value < 10000 && p.price > maxPrice.value) return false;
      if (p.rating < minRating.value) return false;
      return true;
    });
  });

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Filter Products</h1>

      <div class="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar */}
        <div class="md:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Category filter */}
            <div>
              <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Category
              </h2>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory.value === ''}
                    onChange$={() => {
                      selectedCategory.value = '';
                    }}
                    class="text-blue-600"
                  />
                  <span class="text-sm text-gray-700">All</span>
                </label>
                {ALL_CATEGORIES.map((cat) => (
                  <label key={cat} class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory.value === cat}
                      onChange$={() => {
                        selectedCategory.value = cat;
                      }}
                      class="text-blue-600"
                    />
                    <span class="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Max Price
              </h2>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={maxPrice.value > 1000 ? 1000 : maxPrice.value}
                onInput$={(e) => {
                  const val = parseInt((e.target as HTMLInputElement).value, 10);
                  maxPrice.value = val >= 1000 ? 10000 : val;
                }}
                class="w-full"
              />
              <p class="text-sm text-gray-600 mt-1">
                Up to ${maxPrice.value >= 10000 ? '∞' : maxPrice.value}
              </p>
            </div>

            {/* Rating filter */}
            <div>
              <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Min Rating
              </h2>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating.value}
                onInput$={(e) => {
                  minRating.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                class="w-full"
              />
              <p class="text-sm text-gray-600 mt-1">★ {minRating.value.toFixed(1)}+</p>
            </div>

            {/* Reset */}
            <button
              onClick$={() => {
                selectedCategory.value = '';
                minPrice.value = 0;
                maxPrice.value = 10000;
                minRating.value = 0;
              }}
              class="w-full text-sm text-blue-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div class="flex-1">
          <p class="text-sm text-gray-500 mb-4">{filtered.value.length} products found</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.value.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={300}
                  class="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div class="p-4">
                  <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h2>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <span class="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.value.length === 0 && (
            <div class="text-center py-16 text-gray-500">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Filter Products — Benchmark Shop',
};
