<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { cartCount, loadCart } from '$lib/cart';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  let count = $state(0);

  onMount(() => {
    loadCart();
    const unsub = cartCount.subscribe((v) => { count = v; });
    return unsub;
  });
</script>

<nav class="bg-white border-b border-gray-200 px-4 py-3">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-blue-600">Benchmark Shop</a>
    <div class="flex gap-6">
      <a href="/" class="text-gray-600 hover:text-blue-600">Products</a>
      <a href="/filter" class="text-gray-600 hover:text-blue-600">Filter</a>
      <a href="/cart" class="text-gray-600 hover:text-blue-600">
        Cart{#if count > 0} <span>{count}</span>{/if}
      </a>
    </div>
  </div>
</nav>

<main class="min-h-screen bg-gray-50">
  {@render children()}
</main>
