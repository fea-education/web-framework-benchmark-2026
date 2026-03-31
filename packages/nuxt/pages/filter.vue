<script setup lang="ts">
definePageMeta({
  ssr: false,
})

const config = useRuntimeConfig()
const filterStore = useFilterStore()

onMounted(async () => {
  if (filterStore.products.length === 0) {
    await filterStore.fetchProducts(config.public.apiUrl)
  }
})

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Food & Beverage',
  'Beauty',
]

const cartStore = useCartStore()

function addToCart(product: Parameters<typeof cartStore.addItem>[0]) {
  cartStore.addItem(product)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-neutral-900">Filter Products</h2>
      <p class="text-neutral-500 mt-1">{{ filterStore.filteredProducts.length }} of {{ filterStore.products.length }} products</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar filters -->
      <aside class="w-full lg:w-64 shrink-0">
        <div class="bg-surface rounded-[var(--radius-card)] shadow-card p-6 sticky top-24">
          <h3 class="font-semibold text-neutral-900 mb-4">Filters</h3>

          <!-- Category -->
          <div class="mb-6">
            <label class="text-sm font-medium text-neutral-700 block mb-2">Category</label>
            <select
              :value="filterStore.selectedCategory"
              class="w-full border border-neutral-200 rounded-[var(--radius-button)] px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
              @change="filterStore.setCategory(($event.target as HTMLSelectElement).value)"
            >
              <option value="">All Categories</option>
              <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Price range -->
          <div class="mb-6">
            <label class="text-sm font-medium text-neutral-700 block mb-2">
              Max Price: ${{ filterStore.maxPrice }}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              :value="filterStore.maxPrice"
              class="w-full accent-brand-600"
              @input="filterStore.setMaxPrice(Number(($event.target as HTMLInputElement).value))"
            />
            <div class="flex justify-between text-xs text-neutral-400 mt-1">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

          <!-- Min rating -->
          <div class="mb-6">
            <label class="text-sm font-medium text-neutral-700 block mb-2">
              Min Rating: {{ filterStore.minRating.toFixed(1) }} ★
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              :value="filterStore.minRating"
              class="w-full accent-brand-600"
              @input="filterStore.setMinRating(Number(($event.target as HTMLInputElement).value))"
            />
            <div class="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0★</span>
              <span>5★</span>
            </div>
          </div>

          <button
            class="w-full text-sm text-neutral-600 hover:text-brand-600 underline"
            @click="filterStore.resetFilters"
          >
            Reset all filters
          </button>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="flex-1">
        <div v-if="filterStore.loading" class="text-neutral-400 text-center py-16">
          Loading products…
        </div>

        <div v-else-if="filterStore.error" class="text-danger font-medium p-4 bg-red-50 rounded-lg">
          {{ filterStore.error }}
        </div>

        <div v-else-if="filterStore.filteredProducts.length === 0" class="text-neutral-400 text-center py-16">
          No products match the current filters.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="product in filterStore.filteredProducts"
            :key="product.id"
            class="bg-surface rounded-[var(--radius-card)] shadow-card overflow-hidden"
          >
            <NuxtLink :to="`/products/${product.id}`">
              <div class="relative aspect-[4/3] bg-neutral-100">
                <NuxtImg
                  :src="product.image_url"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                  width="400"
                  height="300"
                  loading="lazy"
                />
              </div>
            </NuxtLink>
            <div class="p-4">
              <span class="inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-[var(--radius-badge)] mb-2">
                {{ product.category }}
              </span>
              <h3 class="font-semibold text-neutral-900 text-sm line-clamp-2 mb-1">{{ product.name }}</h3>
              <div class="flex items-center justify-between mt-2">
                <span class="font-bold text-neutral-900">${{ product.price.toFixed(2) }}</span>
                <span class="text-xs text-neutral-500">★ {{ product.rating.toFixed(1) }}</span>
              </div>
              <button
                class="mt-3 w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-button)] transition-colors"
                @click="addToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
