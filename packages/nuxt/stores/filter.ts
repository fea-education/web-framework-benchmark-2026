import { defineStore } from 'pinia'
import type { Product } from '@benchmark/data'

interface FilterState {
  selectedCategory: string
  minPrice: number
  maxPrice: number
  minRating: number
  products: Product[]
  loading: boolean
  error: string | null
}

export const useFilterStore = defineStore('filter', {
  state: (): FilterState => ({
    selectedCategory: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    products: [],
    loading: false,
    error: null,
  }),

  getters: {
    filteredProducts: (state): Product[] => {
      return state.products.filter((product) => {
        const matchesCategory =
          !state.selectedCategory || product.category === state.selectedCategory
        const matchesPrice =
          product.price >= state.minPrice && product.price <= state.maxPrice
        const matchesRating = product.rating >= state.minRating
        return matchesCategory && matchesPrice && matchesRating
      })
    },

    categories: (state): string[] => {
      const cats = new Set(state.products.map((p) => p.category))
      return Array.from(cats).sort()
    },
  },

  actions: {
    async fetchProducts(_apiUrl?: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ data: Product[] }>('/api/products')
        this.products = response.data
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to fetch products'
      } finally {
        this.loading = false
      }
    },

    setCategory(category: string) {
      this.selectedCategory = category
    },

    setMinPrice(price: number) {
      this.minPrice = price
    },

    setMaxPrice(price: number) {
      this.maxPrice = price
    },

    setMinRating(rating: number) {
      this.minRating = rating
    },

    resetFilters() {
      this.selectedCategory = ''
      this.minPrice = 0
      this.maxPrice = 1000
      this.minRating = 0
    },
  },
})
