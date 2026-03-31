import { defineStore } from 'pinia'
import type { Product } from '@benchmark/data'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state): number => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    totalPrice: (state): number => {
      return state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      )
    },
  },

  actions: {
    addItem(product: Product) {
      const existing = this.items.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ product, quantity: 1 })
      }
    },

    removeItem(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId)
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
