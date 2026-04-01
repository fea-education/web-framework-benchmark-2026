<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import type { CartItem } from '@benchmark/data';
  import { onMount } from 'svelte';

  // Cart store: list of CartItem
  const cartItems = writable<CartItem[]>([]);

  // Derived total
  const cartTotal = derived(cartItems, ($items) =>
    $items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  const cartCount = derived(cartItems, ($items) =>
    $items.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Hydrate from localStorage on mount
  onMount(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        cartItems.set(JSON.parse(stored) as CartItem[]);
      }
    } catch {
      // ignore parse errors
    }

    // Persist changes back to localStorage
    const unsubscribe = cartItems.subscribe((items) => {
      localStorage.setItem('cart', JSON.stringify(items));
    });

    return unsubscribe;
  });

  function removeFromCart(productId: number) {
    cartItems.update((items) => items.filter((i) => i.product.id !== productId));
  }

  function updateQuantity(productId: number, delta: number) {
    cartItems.update((items) => {
      return items
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
    });
  }
</script>

<svelte:head>
  <title>Cart — Benchmark Shop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Cart items -->
    <div class="flex-1">
      {#if $cartItems.length === 0}
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <p class="text-gray-400 text-lg mb-4">Your cart is empty</p>
          <a href="/" class="text-blue-600 hover:underline">Browse products</a>
        </div>
      {:else}
        <div class="space-y-4">
          {#each $cartItems as item (item.product.id)}
            <div role="article" class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                width="80"
                height="80"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{item.product.name}</h3>
                <p class="text-sm text-gray-500">{item.product.category}</p>
                <p class="text-blue-600 font-bold">${item.product.price.toFixed(2)}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  onclick={() => updateQuantity(item.product.id, -1)}
                  aria-label="Decrease quantity"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span class="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onclick={() => updateQuantity(item.product.id, 1)}
                  aria-label="Increase quantity"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onclick={() => removeFromCart(item.product.id)}
                aria-label="Remove"
                class="text-red-500 hover:text-red-700 text-sm font-medium ml-2 transition-colors"
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Order summary -->
    <div class="lg:w-72">
      <div class="bg-white rounded-xl shadow-sm p-5 sticky top-4">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Items ({$cartCount})</span>
            <span>${$cartTotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span class="text-green-600">Free</span>
          </div>
          <hr class="my-2" />
          <div class="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>${$cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          disabled={$cartItems.length === 0}
          class="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</div>
