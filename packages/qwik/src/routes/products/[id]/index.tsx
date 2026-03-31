import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { ApiResponse, Product } from '@benchmark/data';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const useProduct = routeLoader$(async ({ params, status }) => {
  try {
    const res = await fetch(`${API_URL}/products/${params['id']}`);
    if (!res.ok) {
      status(404);
      return null;
    }
    const json = (await res.json()) as ApiResponse<Product>;
    return json.data;
  } catch {
    status(404);
    return null;
  }
});

export default component$(() => {
  const product = useProduct();

  if (!product.value) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
      </div>
    );
  }

  const p = product.value;

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2">
            <img
              src={p.image_url}
              alt={p.name}
              width={400}
              height={300}
              class="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div class="md:w-1/2 p-6">
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {p.category}
            </span>
            <h1 class="mt-3 text-2xl font-bold text-gray-900">{p.name}</h1>
            <p class="mt-2 text-gray-600">{p.description}</p>

            <div class="mt-4 flex items-center gap-2">
              <span class="text-3xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
            </div>

            <div class="mt-2 flex items-center gap-1">
              <span class="text-yellow-500">★</span>
              <span class="text-gray-700">{p.rating.toFixed(1)}</span>
              <span class="text-gray-500 text-sm">/ 5.0</span>
            </div>

            <div class="mt-4">
              <span class="text-sm text-gray-600">
                {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span key={tag} class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <button
              class="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              disabled={p.stock === 0}
            >
              {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue, params }) => {
  const product = resolveValue(useProduct);
  return {
    title: product ? `${product.name} — Benchmark Shop` : 'Product Not Found',
    meta: [
      {
        name: 'description',
        content: product ? product.description : 'Product not found',
      },
    ],
  };
};
