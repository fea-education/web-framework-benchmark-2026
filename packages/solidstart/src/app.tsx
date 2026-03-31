// @refresh reload
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./global.css";

export default function App() {
  return (
    <Router
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
              <a href="/cart" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">
                Cart
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
