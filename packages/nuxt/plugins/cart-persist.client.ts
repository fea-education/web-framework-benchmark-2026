// Persist cart state to localStorage across full page navigations
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const cartStore = useCartStore()

  // Restore from localStorage on startup
  try {
    const saved = localStorage.getItem('benchshop-cart')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        cartStore.items = parsed
      }
    }
  } catch {
    // ignore parse errors
  }

  // Persist to localStorage on every change
  watch(
    () => cartStore.items,
    (items) => {
      try {
        localStorage.setItem('benchshop-cart', JSON.stringify(items))
      } catch {
        // ignore storage errors
      }
    },
    { deep: true },
  )
})
