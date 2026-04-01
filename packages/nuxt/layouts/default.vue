<script setup lang="ts">
const cartStore = useCartStore()
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Header -->
    <header class="bg-surface shadow-card sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <p class="text-2xl font-bold text-brand-700">
          <NuxtLink to="/">BenchShop</NuxtLink>
        </p>
        <nav class="flex gap-6">
          <NuxtLink to="/" class="text-neutral-600 hover:text-brand-600 transition-colors">Products</NuxtLink>
          <NuxtLink to="/filter" class="text-neutral-600 hover:text-brand-600 transition-colors">Filter</NuxtLink>
          <NuxtLink to="/cart" class="text-neutral-600 hover:text-brand-600 transition-colors">Cart<span v-if="cartStore.totalItems > 0"> {{ cartStore.totalItems }}</span></NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-neutral-900 text-neutral-400 text-sm py-6 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        &copy; 2026 BenchShop — Nuxt 3 benchmark app
      </div>
    </footer>
  </div>
</template>
