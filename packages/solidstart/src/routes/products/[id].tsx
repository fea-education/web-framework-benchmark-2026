import { createAsync, cache, useParams } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import type { ApiResponse, Product } from "@benchmark/data";
import { A } from "@solidjs/router";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3000";

const getProduct = cache(async (id: string) => {
  "use server";
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<Product>;
    return json.data;
  } catch {
    return null;
  }
}, "product");

export const route = {
  preload: ({ params }: { params: { id: string } }) =>
    getProduct(params.id),
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = createAsync(() => getProduct(params.id));

  return (
    <Suspense
      fallback={
        <div class="flex h-64 items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      }
    >
      <Show
        when={product()}
        fallback={
          <div class="text-center py-16">
            <h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
            <A href="/" class="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to products
            </A>
          </div>
        }
      >
        {(p) => (
          <div class="max-w-4xl mx-auto">
            <A
              href="/"
              class="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6"
            >
              ← Back to products
            </A>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={p().image_url}
                  alt={p().name}
                  width={600}
                  height={450}
                  class="w-full h-auto object-cover"
                />
              </div>
              <div class="flex flex-col gap-4">
                <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                  {p().category}
                </span>
                <h1 class="text-2xl font-bold text-gray-900">{p().name}</h1>
                <p class="text-gray-600 text-sm leading-relaxed">
                  {p().description}
                </p>
                <div class="flex items-center gap-4">
                  <span class="text-3xl font-bold text-gray-900">
                    ${p().price.toFixed(2)}
                  </span>
                  <span class="text-sm text-gray-500">
                    ★ {p().rating.toFixed(1)}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2 mt-2">
                  {p()
                    .tags.map((tag) => (
                      <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                </div>
                <p class="text-sm font-medium text-gray-700">
                  {p().stock > 0 ? (
                    <span class="text-green-600">{p().stock} in stock</span>
                  ) : (
                    <span class="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
