<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import type { Product, Category, ApiResponse } from '@benchmark/data';

  // Use the SvelteKit proxy route so browser doesn't need direct API access
  const apiUrl = '/api';

  // All products loaded client-side
  const allProducts = writable<Product[]>([]);
  const loading = writable(true);
  const error = writable<string | null>(null);

  // Filter state
  const selectedCategory = writable<Category | ''>('');
  const minPrice = writable(0);
  const maxPrice = writable(1000);
  const minRating = writable(0);

  // Derived filtered products
  const filteredProducts = derived(
    [allProducts, selectedCategory, minPrice, maxPrice, minRating],
    ([$all, $cat, $min, $max, $rating]) => {
      return $all.filter((p) => {
        if ($cat && p.category !== $cat) return false;
        if (p.price < $min || p.price > $max) return false;
        if (p.rating < $rating) return false;
        return true;
      });
    }
  );

  const categories: Category[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Food & Beverage',
    'Beauty'
  ];

  onMount(async () => {
    try {
      const res = await fetch(`${apiUrl}/products`);
      const json: ApiResponse<Product[]> = await res.json() as ApiResponse<Product[]>;
      allProducts.set(json.data);
    } catch (e) {
      error.set('Failed to load products');
    } finally {
      loading.set(false);
    }
  });

  function resetFilters() {
    selectedCategory.set('');
    minPrice.set(0);
    maxPrice.set(1000);
    minRating.set(0);
  }
</script>

<svelte:head>
  <title>Filter Products — Benchmark Shop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Filter Products</h1>

  <div class="flex flex-col md:flex-row gap-8">
    <!-- Sidebar filters -->
    <aside class="md:w-64 shrink-0">
      <div class="bg-white rounded-xl shadow-sm p-5 space-y-6">
        <div>
          <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            id="category"
            bind:value={$selectedCategory}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {#each categories as cat (cat)}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Min Price: ${$minPrice}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            bind:value={$minPrice}
            class="w-full accent-blue-600"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Max Price: ${$maxPrice}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            bind:value={$maxPrice}
            class="w-full accent-blue-600"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Min Rating: {$minRating.toFixed(1)}★
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            bind:value={$minRating}
            class="w-full accent-blue-600"
          />
        </div>

        <button
          onclick={resetFilters}
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm"
        >
          Reset Filters
        </button>
      </div>
    </aside>

    <!-- Product grid -->
    <div class="flex-1">
      {#if $loading}
        <div class="flex items-center justify-center h-64">
          <span class="text-gray-500">Loading products…</span>
        </div>
      {:else if $error}
        <div class="text-red-600 text-center py-12">{$error}</div>
      {:else}
        <p class="text-sm text-gray-500 mb-4">{$filteredProducts.length} products found</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {#each $filteredProducts as product (product.id)}
            <a href="/products/{product.id}" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                width="400"
                height="300"
                class="w-full h-44 object-cover"
                loading="lazy"
              />
              <div class="p-4">
                <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{product.category}</span>
                <h2 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span class="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
                </div>
              </div>
            </a>
          {/each}
        </div>
        {#if $filteredProducts.length === 0}
          <div class="text-center py-16 text-gray-400">No products match your filters.</div>
        {/if}
      {/if}
    </div>
  </div>
</div>
