import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { CartContext } from '../../context/cart';

export default component$(() => {
  const cartStore = useContext(CartContext);

  const totalItems = cartStore.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartStore.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems} items)</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart items — delegate events to a container with a stable handler */}
        <div
          class="md:col-span-2 space-y-4"
          onClick$={(e) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('[data-action]') as HTMLElement | null;
            if (!btn) return;
            const action = btn.dataset['action'];
            const idStr = btn.dataset['id'];
            if (!idStr) return;
            const productId = Number(idStr);
            if (action === 'increment') {
              const idx = cartStore.items.findIndex((i) => i.product.id === productId);
              const entry = idx !== -1 ? cartStore.items[idx] : undefined;
              if (entry) {
                entry.quantity = entry.quantity + 1;
              }
            } else if (action === 'decrement') {
              const idx = cartStore.items.findIndex((i) => i.product.id === productId);
              if (idx === -1) return;
              const entry = cartStore.items[idx];
              if (!entry) return;
              if (entry.quantity <= 1) {
                cartStore.items.splice(idx, 1);
              } else {
                entry.quantity = entry.quantity - 1;
              }
            } else if (action === 'remove') {
              const idx = cartStore.items.findIndex((i) => i.product.id === productId);
              if (idx !== -1) {
                cartStore.items.splice(idx, 1);
              }
            }
          }}
        >
          {cartStore.items.length === 0 ? (
            <div class="bg-white rounded-xl shadow-sm p-8 text-center">
              <p class="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cartStore.items.map((item) => (
              <article key={item.product.id} role="article" class="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{item.product.name}</h3>
                  <p class="text-sm text-blue-600">{item.product.category}</p>
                  <p class="text-gray-700 font-bold mt-1">${item.product.price.toFixed(2)}</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <div class="flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      data-action="decrement"
                      data-id={String(item.product.id)}
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      data-action="increment"
                      data-id={String(item.product.id)}
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    aria-label="Remove item"
                    data-action="remove"
                    data-id={String(item.product.id)}
                    class="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Order summary */}
        <div class="md:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Items ({totalItems})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr class="my-3" />
              <div class="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              class="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={cartStore.items.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Cart — Benchmark Shop',
};
