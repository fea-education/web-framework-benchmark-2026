import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <nav class="bg-white border-b border-gray-200 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" class="text-xl font-bold text-blue-600">Benchmark Shop</Link>
          <div class="flex gap-6">
            <Link href="/" class="text-gray-600 hover:text-blue-600">Products</Link>
            <Link href="/filter" class="text-gray-600 hover:text-blue-600">Filter</Link>
            <Link href="/cart" class="text-gray-600 hover:text-blue-600">Cart</Link>
          </div>
        </div>
      </nav>

      <main class="min-h-screen bg-gray-50">
        <Slot />
      </main>
    </>
  );
});
