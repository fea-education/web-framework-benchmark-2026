<script lang="ts">
  import type { PageData } from './$types';
  import type { Product } from '@benchmark/data';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let product = $derived(data.product);
</script>

<svelte:head>
  <title>{product.name} — Benchmark Shop</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <a href="/" class="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Products</a>

  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="md:flex">
      <div class="md:w-1/2">
        <img
          src={product.image_url}
          alt={product.name}
          width="400"
          height="300"
          class="w-full h-64 md:h-full object-cover"
        />
      </div>
      <div class="md:w-1/2 p-6">
        <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h1 class="mt-3 text-2xl font-bold text-gray-900">{product.name}</h1>
        <p class="mt-3 text-gray-600">{product.description}</p>
        <div class="mt-4 flex items-center gap-3">
          <span class="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span class="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          {product.stock} in stock
        </div>
        {#if product.tags.length > 0}
          <div class="mt-4 flex flex-wrap gap-2">
            {#each product.tags as tag (tag)}
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
            {/each}
          </div>
        {/if}
        <a
          href="/cart"
          class="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
        >
          Add to Cart
        </a>
      </div>
    </div>
  </div>
</div>
