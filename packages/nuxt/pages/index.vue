<script setup lang="ts">
import type { Product } from '@benchmark/data'

interface ApiResponse {
  data: Product[]
}

definePageMeta({
  prerender: true,
})

const config = useRuntimeConfig()
const { data, error } = await useFetch<ApiResponse>('/products', {
  baseURL: config.public.apiUrl,
})

const products = computed(() => data.value?.data ?? [])
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-neutral-900">All Products</h2>
      <p class="text-neutral-500 mt-1">{{ products.length }} products available</p>
    </div>

    <div v-if="error" class="text-danger font-medium p-4 bg-red-50 rounded-lg">
      Error loading products: {{ error.message }}
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="bg-surface rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <NuxtImg
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
            width="400"
            height="300"
            loading="lazy"
          />
        </div>
        <div class="p-4">
          <span class="inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-[var(--radius-badge)] mb-2">
            {{ product.category }}
          </span>
          <h3 class="font-semibold text-neutral-900 text-sm line-clamp-2 mb-1">{{ product.name }}</h3>
          <div class="flex items-center justify-between mt-2">
            <span class="font-bold text-neutral-900">${{ product.price.toFixed(2) }}</span>
            <span class="text-xs text-neutral-500">★ {{ product.rating.toFixed(1) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
