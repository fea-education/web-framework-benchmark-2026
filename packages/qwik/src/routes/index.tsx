import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { ApiResponse, Product } from '@benchmark/data';
import { Link } from '@builder.io/qwik-city';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const useProducts = routeLoader$(async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) return [] as Product[];
    const json = (await res.json()) as ApiResponse<Product[]>;
    return json.data;
  } catch {
    return [] as Product[];
  }
});

export default component$(() => {
  const products = useProducts();

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.value.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <img
              src={product.image_url}
              alt={product.name}
              width={400}
              height={300}
              class="w-full h-48 object-cover"
              loading="lazy"
            />
            <div class="p-4">
              <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span class="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Products — Benchmark Shop',
  meta: [
    {
      name: 'description',
      content: 'Browse our 100 products across 8 categories',
    },
  ],
};
