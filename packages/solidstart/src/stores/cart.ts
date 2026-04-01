import { createStore, produce } from "solid-js/store";
import type { Product, CartItem } from "@benchmark/data";

const [cartStore, setCartStore] = createStore<{ items: CartItem[] }>({ items: [] });

export function hydrateCart(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("cart");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as CartItem[];
      setCartStore({ items: parsed });
    } catch { /* ignore */ }
  }
}

function persist(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cartStore.items));
  }
}

export function addToCart(product: Product): void {
  setCartStore(produce(state => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({ product, quantity: 1 });
    }
  }));
  persist();
}

export function removeFromCart(productId: number): void {
  setCartStore(produce(state => {
    state.items = state.items.filter(i => i.product.id !== productId);
  }));
  persist();
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) { removeFromCart(productId); return; }
  setCartStore(produce(state => {
    const item = state.items.find(i => i.product.id === productId);
    if (item) item.quantity = quantity;
  }));
  persist();
}

export { cartStore };
