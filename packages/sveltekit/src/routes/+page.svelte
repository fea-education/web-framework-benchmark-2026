<script lang="ts">
  import type { PageData } from './$types';
  import type { Product } from '@benchmark/data';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Products — Benchmark Shop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each data.products as product (product.id)}
      <div role="article" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <a href="/products/{product.id}" class="block" data-sveltekit-reload>
          <img
            src={product.image_url}
            alt={product.name}
            width="400"
            height="300"
            class="w-full h-48 object-cover"
            loading="lazy"
          />
          <div class="p-4">
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{product.category}</span>
            <h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span class="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>
