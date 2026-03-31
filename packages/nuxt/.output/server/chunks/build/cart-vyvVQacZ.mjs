import { defineStore } from 'pinia';

const useCartStore = defineStore("cart", {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice: (state) => {
      return state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
    }
  },
  actions: {
    addItem(product) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push({ product, quantity: 1 });
      }
    },
    removeItem(productId) {
      this.items = this.items.filter((i) => i.product.id !== productId);
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart() {
      this.items = [];
    }
  }
});

export { useCartStore as u };
//# sourceMappingURL=cart-vyvVQacZ.mjs.map
