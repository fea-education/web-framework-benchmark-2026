import { createMemo, For, Show, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { cartStore, removeFromCart, updateQuantity, hydrateCart } from "../stores/cart";

export default function CartPage() {
  onMount(() => {
    hydrateCart();
  });

  const totalItems = createMemo(() =>
    cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = createMemo(() =>
    cartStore.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  return (
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart{" "}
        <Show when={totalItems() > 0}>
          <span class="text-lg font-normal text-gray-500">
            ({totalItems()} item{totalItems() !== 1 ? "s" : ""})
          </span>
        </Show>
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div class="lg:col-span-2">
          <Show
            when={cartStore.items.length > 0}
            fallback={
              <div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p class="text-gray-500 mb-4">Your cart is empty</p>
                <A
                  href="/"
                  class="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </A>
              </div>
            }
          >
            <div class="flex flex-col gap-4">
              <For each={cartStore.items}>
                {(item) => (
                  <article role="article" class="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900 text-sm line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p class="text-xs text-gray-500 mt-1">{item.product.category}</p>
                      <p class="text-base font-bold text-gray-900 mt-2">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        class="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                      <div class="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          aria-label="Quantity"
                          value={item.quantity}
                          min={1}
                          class="w-12 text-center text-sm font-medium text-gray-900 border border-gray-300 rounded"
                          onInput={(e) =>
                            updateQuantity(
                              item.product.id,
                              parseInt(e.currentTarget.value) || 1
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                      <p class="text-sm font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </article>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Summary */}
        <div class="flex flex-col gap-4">
          {/* Order Summary */}
          <Show when={cartStore.items.length > 0}>
            <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 class="text-base font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Items ({totalItems()})</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 mt-3">
                <div class="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
              </div>
              <button class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
