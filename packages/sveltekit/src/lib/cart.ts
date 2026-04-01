import { writable, derived, get } from 'svelte/store';
import type { CartItem } from '@benchmark/data';

export const cartItems = writable<CartItem[]>([]);

export const cartCount = derived(cartItems, ($items) =>
  $items.reduce((sum, item) => sum + item.quantity, 0)
);

export function loadCart() {
  if (typeof localStorage === 'undefined') return;
  try {
    const stored = localStorage.getItem('cart');
    cartItems.set(stored ? (JSON.parse(stored) as CartItem[]) : []);
  } catch {
    cartItems.set([]);
  }
}

export function addToCart(product: CartItem['product']) {
  cartItems.update((items) => {
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      return items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...items, { product, quantity: 1 }];
  });
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(get(cartItems)));
  }
}
