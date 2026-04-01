import { component$, Slot, useStore, useContextProvider, useVisibleTask$, useComputed$, useSignal } from '@builder.io/qwik';
import { CartContext, type CartStore } from '../context/cart';

export default component$(() => {
  const cartStore = useStore<CartStore>({ items: [] });
  useContextProvider(CartContext, cartStore);
  const initialized = useSignal(false);

  // Step 1: Hydrate cart from localStorage on client
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartStore['items'];
        cartStore.items = parsed;
      } catch {
        // ignore parse errors
      }
    }
    initialized.value = true;
  });

  // Step 2: Persist cart to localStorage whenever it changes (after initialization)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const items = track(() => cartStore.items);
    if (initialized.value) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  });

  // Use useComputed$ so totalQuantity is a derived signal, not inline
  const totalQuantity = useComputed$(() =>
    cartStore.items.reduce((s, i) => s + i.quantity, 0)
  );

  return (
    <>
      <nav class="bg-white border-b border-gray-200 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="text-xl font-bold text-blue-600">Benchmark Shop</a>
          <div class="flex gap-6">
            <a href="/" class="text-gray-600 hover:text-blue-600">Products</a>
            <a href="/filter/" class="text-gray-600 hover:text-blue-600">Filter</a>
            <a href="/cart/" class="text-gray-600 hover:text-blue-600">
              Cart
              {totalQuantity.value > 0 && (
                <span class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {totalQuantity.value}
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>

      <main class="min-h-screen bg-gray-50">
        <Slot />
      </main>
    </>
  );
});
