import { component$, useStore } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import type { Product } from '@benchmark/data';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Demo products for cart CSR demo (in a real app this would be managed via context/state)
const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium sound quality with noise cancellation',
    price: 79.99,
    category: 'Electronics',
    stock: 15,
    rating: 4.5,
    image_url: 'https://picsum.photos/seed/product-1/400/300',
    tags: ['wireless', 'audio', 'bluetooth'],
  },
  {
    id: 2,
    name: 'Running Shoes',
    description: 'Lightweight and comfortable for all terrain',
    price: 59.99,
    category: 'Sports',
    stock: 30,
    rating: 4.2,
    image_url: 'https://picsum.photos/seed/product-2/400/300',
    tags: ['running', 'sports', 'shoes'],
  },
];

export default component$(() => {
  const cart = useStore<CartState>({ items: [] });

  const addToCart = (product: Product) => {
    const existing = cart.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ product, quantity: 1 });
    }
  };

  const removeFromCart = (productId: number) => {
    const idx = cart.items.findIndex((i) => i.product.id === productId);
    if (idx !== -1) {
      cart.items.splice(idx, 1);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = cart.items.find((i) => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems} items)</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart items */}
        <div class="md:col-span-2 space-y-4">
          {cart.items.length === 0 ? (
            <div class="bg-white rounded-xl shadow-sm p-8 text-center">
              <p class="text-gray-500">Your cart is empty.</p>
              <p class="text-sm text-gray-400 mt-2">
                Add some products below to get started.
              </p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.product.id} class="bg-white rounded-xl shadow-sm p-4 flex gap-4">
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
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      onClick$={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      onClick$={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    class="text-sm text-red-500 hover:text-red-700"
                    onClick$={() => removeFromCart(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Demo products to add */}
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Add</h2>
            <div class="space-y-3">
              {DEMO_PRODUCTS.map((product) => (
                <div key={product.id} class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{product.name}</p>
                    <p class="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick$={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
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
              disabled={cart.items.length === 0}
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
