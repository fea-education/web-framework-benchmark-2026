import { createSignal, createMemo, For, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import type { Product, CartItem } from '@benchmark/data';

interface CartPageProps {
  sampleProducts: Product[];
}

export default function CartPage(props: CartPageProps) {
  const [cartItems, setCartItems] = createStore<CartItem[]>([]);
  const [sampleProducts] = createSignal<Product[]>(props.sampleProducts);

  const totalItems = createMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = createMemo(() =>
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  const addToCart = (product: Product) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === product.id);
    if (existingIndex >= 0) {
      setCartItems(
        produce((items) => {
          const item = items[existingIndex];
          if (item) item.quantity += 1;
        })
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.product.id !== productId));
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
  };

  const clearCart = () => {
    setCartItems([]);
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
              <p class="text-neutral-400 text-sm mb-6">Add some products from the list below</p>
              <a href="/" class="text-brand-600 hover:text-brand-700 font-medium">
                Browse products
              </a>
            </div>
          }
        >
          <div class="space-y-4">
            <For each={cartItems}>
              {(item) => (
                <div class="bg-white rounded-xl border border-neutral-200 p-4 flex gap-4 items-center">
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
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span class="w-8 text-center text-sm font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
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
                      class="text-xs text-danger hover:text-red-700 mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>

          <button
            onClick={clearCart}
            class="mt-4 text-sm text-neutral-500 hover:text-danger transition-colors"
          >
            Clear cart
          </button>
        </Show>

        {/* Sample Products to Add */}
        <div class="mt-10">
          <h2 class="text-xl font-bold text-neutral-900 mb-4">Add Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <For each={sampleProducts().slice(0, 8)}>
              {(product) => (
                <div class="bg-white rounded-xl border border-neutral-200 p-3 flex gap-3 items-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    class="w-14 h-14 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="text-xs font-semibold text-neutral-900 truncate">{product.name}</h3>
                    <p class="text-xs text-neutral-500">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    class="flex-shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </For>
          </div>
        </div>
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
              <span class="text-success">Free</span>
            </div>
            <div class="border-t border-neutral-200 pt-3 flex justify-between text-base font-bold text-neutral-900">
              <span>Total</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            class="mt-6 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            Checkout
          </button>

          <a href="/" class="mt-3 block text-center text-sm text-brand-600 hover:text-brand-700">
            Continue shopping
          </a>
        </div>
      </div>
    </div>
  );
}
