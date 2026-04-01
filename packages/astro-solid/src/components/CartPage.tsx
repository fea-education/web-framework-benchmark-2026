import { createMemo, For, Show, onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import type { CartItem } from '@benchmark/data';

interface CartPageProps {
  sampleProducts?: unknown[];
}

export default function CartPage(_props: CartPageProps) {
  const [cartItems, setCartItems] = createStore<CartItem[]>([]);

  onMount(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setCartItems(parsed);
      }
    } catch (_) {
      // ignore malformed cart data
    }
  });

  const persistCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (_) {
      // ignore
    }
  };

  const totalItems = createMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = createMemo(() =>
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  const removeFromCart = (productId: number) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    setCartItems(updated);
    persistCart(updated);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(
      produce((items) => {
        const item = items.find((i) => i.product.id === productId);
        if (item) item.quantity = quantity;
      })
    );
    persistCart([...cartItems]);
  };

  const clearCart = () => {
    setCartItems([]);
    persistCart([]);
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-neutral-900 mb-6">
          Shopping Cart
          <Show when={totalItems() > 0}>
            <span class="ml-3 text-lg font-normal text-neutral-500">({totalItems()} items)</span>
          </Show>
        </h1>

        <Show
          when={cartItems.length > 0}
          fallback={
            <div class="text-center py-16 bg-white rounded-xl border border-neutral-200">
              <p class="text-neutral-500 text-lg mb-2">Your cart is empty</p>
              <p class="text-neutral-400 text-sm mb-6">Browse products and add them to your cart</p>
              <a href="/" class="text-brand-600 hover:text-brand-700 font-medium">
                Browse products
              </a>
            </div>
          }
        >
          <div class="space-y-4">
            <For each={cartItems}>
              {(item) => (
                <article role="article" class="bg-white rounded-xl border border-neutral-200 p-4 flex gap-4 items-center">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    loading="lazy"
                    class="w-20 h-20 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-semibold text-neutral-900 truncate">
                      {item.product.name}
                    </h3>
                    <p class="text-xs text-brand-600 mt-0.5">{item.product.category}</p>
                    <p class="text-sm font-bold text-neutral-900 mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span class="w-8 text-center text-sm font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div class="flex-shrink-0 text-right">
                    <p class="text-sm font-bold text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      class="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              )}
            </For>
          </div>

          <button
            onClick={clearCart}
            class="mt-4 text-sm text-neutral-500 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </Show>
      </div>

      {/* Order Summary */}
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-neutral-900 mb-4">Order Summary</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-neutral-600">
              <span>Items ({totalItems()})</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="border-t border-neutral-200 pt-3 flex justify-between text-base font-bold text-neutral-900">
              <span>Total</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            class="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            Checkout
          </button>

          <a href="/" class="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700">
            Continue shopping
          </a>
        </div>
      </div>
    </div>
  );
}
