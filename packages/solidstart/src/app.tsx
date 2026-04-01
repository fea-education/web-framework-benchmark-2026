// @refresh reload
import { Suspense, onMount, Show } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./global.css";
import { cartStore, hydrateCart } from "./stores/cart";

export default function App() {
  onMount(() => hydrateCart());

  return (
    <Router
      explicitLinks
      root={(props) => (
        <>
          <nav class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex gap-6">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">
                Products
              </a>
              <a href="/filter" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">
                Filter
              </a>
              <a href="/cart" class="relative text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors inline-flex items-center gap-1">
                Cart
                <Show when={cartStore.items.reduce((s, i) => s + i.quantity, 0) > 0}>
                  <span class="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold min-w-[1.25rem] h-5 px-1">
                    {cartStore.items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </Show>
              </a>
            </div>
          </nav>
          <main class="max-w-7xl mx-auto px-4 py-8">
            <Suspense>{props.children}</Suspense>
          </main>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
