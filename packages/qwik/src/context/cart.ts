import { createContextId } from '@builder.io/qwik';
import type { CartItem } from '@benchmark/data';

export interface CartStore {
  items: CartItem[];
}

export const CartContext = createContextId<CartStore>('cart');
