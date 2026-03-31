<script setup lang="ts">
import type { Product } from '@benchmark/data'

interface ApiResponse {
  data: Product
}

const route = useRoute()
const config = useRuntimeConfig()
const id = route.params['id'] as string

const { data, error } = await useFetch<ApiResponse>(`/products/${id}`, {
  baseURL: config.public.apiUrl,
})

const product = computed(() => data.value?.data ?? null)

const cartStore = useCartStore()

function addToCart() {
  if (product.value) {
    cartStore.addItem(product.value)
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-brand-600 hover:underline text-sm mb-6 inline-block">
      &larr; Back to products
    </NuxtLink>

    <div v-if="error" class="text-danger font-medium p-4 bg-red-50 rounded-lg">
      Error loading product: {{ error.message }}
    </div>

    <div v-else-if="!product" class="text-neutral-500 text-center py-16">
      Product not found.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Image -->
      <div class="rounded-[var(--radius-card)] overflow-hidden bg-neutral-100 aspect-[4/3]">
        <NuxtImg
          :src="product.image_url"
          :alt="product.name"
          class="w-full h-full object-cover"
          width="800"
          height="600"
        />
      </div>

      <!-- Details -->
      <div class="flex flex-col gap-4">
        <span class="inline-block text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-[var(--radius-badge)] w-fit">
          {{ product.category }}
        </span>
        <h1 class="text-3xl font-bold text-neutral-900">{{ product.name }}</h1>
        <p class="text-neutral-600 leading-relaxed">{{ product.description }}</p>

        <div class="flex items-center gap-4 mt-2">
          <span class="text-3xl font-bold text-neutral-900">${{ product.price.toFixed(2) }}</span>
          <span class="text-neutral-500">★ {{ product.rating.toFixed(1) }} rating</span>
        </div>

        <div class="text-sm text-neutral-500">
          {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
        </div>

        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-[var(--radius-badge)]"
          >
            {{ tag }}
          </span>
        </div>

        <button
          :disabled="product.stock === 0"
          class="mt-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-[var(--radius-button)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          @click="addToCart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>
