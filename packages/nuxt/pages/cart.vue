<script setup lang="ts">
definePageMeta({
  ssr: false,
})

const cartStore = useCartStore()
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-neutral-900">Shopping Cart</h2>
      <p class="text-neutral-500 mt-1">{{ cartStore.totalItems }} item{{ cartStore.totalItems !== 1 ? 's' : '' }}</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <p class="text-neutral-400 text-lg mb-4">Your cart is empty.</p>
      <NuxtLink
        to="/"
        class="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-[var(--radius-button)] transition-colors"
      >
        Browse Products
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart items -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          role="listitem"
          class="bg-surface rounded-[var(--radius-card)] shadow-card p-4 flex gap-4"
        >
          <div class="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
            <NuxtImg
              :src="item.product.image_url"
              :alt="item.product.name"
              class="w-full h-full object-cover"
              width="96"
              height="96"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-neutral-900 text-sm line-clamp-2">{{ item.product.name }}</h3>
            <p class="text-xs text-neutral-500 mt-0.5">{{ item.product.category }}</p>
            <p class="font-bold text-neutral-900 mt-1">${{ item.product.price.toFixed(2) }}</p>
          </div>

          <div class="flex flex-col items-end justify-between shrink-0">
            <button
              class="text-neutral-400 hover:text-danger transition-colors text-sm"
              aria-label="Remove item"
              @click="cartStore.removeItem(item.product.id)"
            >
              ✕
            </button>

            <div class="flex items-center gap-2">
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-700"
                @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
              >
                −
              </button>
              <span class="w-8 text-center font-medium text-neutral-900">{{ item.quantity }}</span>
              <button
                aria-label="Increase quantity"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-700"
                @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="bg-surface rounded-[var(--radius-card)] shadow-card p-6 sticky top-24">
          <h3 class="font-semibold text-neutral-900 text-lg mb-4">Order Summary</h3>

          <div class="space-y-3 text-sm text-neutral-600 mb-6">
            <div class="flex justify-between">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-medium text-neutral-900">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="text-success font-medium">Free</span>
            </div>
            <div class="border-t border-neutral-200 pt-3 flex justify-between font-bold text-neutral-900 text-base">
              <span>Total</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <button
            class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-[var(--radius-button)] transition-colors"
          >
            Checkout (demo)
          </button>

          <button
            class="w-full mt-2 text-sm text-neutral-500 hover:text-danger underline transition-colors"
            @click="cartStore.clearCart"
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
