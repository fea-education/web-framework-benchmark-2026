import { createAsync, cache } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import type { ApiResponse, Product } from "@benchmark/data";
import { A } from "@solidjs/router";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3000";

const getProducts = cache(async () => {
  "use server";
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) return [] as Product[];
    const json = (await res.json()) as ApiResponse<Product[]>;
    return json.data;
  } catch {
    return [] as Product[];
  }
}, "products");

export const route = {
  preload: () => getProducts(),
};

export default function ProductsPage() {
  const products = createAsync(() => getProducts());

  return (
    <Suspense
      fallback={
        <div class="flex h-64 items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      }
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <For each={products()}>
            {(product) => (
              <A
                href={`/products/${product.id}`}
                class="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
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
                  <h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h2>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span class="text-sm text-gray-500">
                      ★ {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <p class="mt-1 text-xs text-gray-400">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>
                </div>
              </A>
            )}
          </For>
        </div>
      </div>
    </Suspense>
  );
}
