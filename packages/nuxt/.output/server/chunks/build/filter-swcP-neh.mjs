import { _ as __nuxt_component_0 } from './nuxt-link-DOsOLPdi.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-DZJUQzfK.mjs';
import { defineComponent, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import { u as useCartStore } from './cart-vyvVQacZ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './v3-F5hY1FLE.mjs';

const useFilterStore = defineStore("filter", {
  state: () => ({
    selectedCategory: "",
    minPrice: 0,
    maxPrice: 1e3,
    minRating: 0,
    products: [],
    loading: false,
    error: null
  }),
  getters: {
    filteredProducts: (state) => {
      return state.products.filter((product) => {
        const matchesCategory = !state.selectedCategory || product.category === state.selectedCategory;
        const matchesPrice = product.price >= state.minPrice && product.price <= state.maxPrice;
        const matchesRating = product.rating >= state.minRating;
        return matchesCategory && matchesPrice && matchesRating;
      });
    },
    categories: (state) => {
      const cats = new Set(state.products.map((p) => p.category));
      return Array.from(cats).sort();
    }
  },
  actions: {
    async fetchProducts(apiUrl) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch(`${apiUrl}/products`);
        this.products = response.data;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },
    setCategory(category) {
      this.selectedCategory = category;
    },
    setMinPrice(price) {
      this.minPrice = price;
    },
    setMaxPrice(price) {
      this.maxPrice = price;
    },
    setMinRating(rating) {
      this.minRating = rating;
    },
    resetFilters() {
      this.selectedCategory = "";
      this.minPrice = 0;
      this.maxPrice = 1e3;
      this.minRating = 0;
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "filter",
  __ssrInlineRender: true,
  setup(__props) {
    const filterStore = useFilterStore();
    const CATEGORIES = [
      "Electronics",
      "Clothing",
      "Books",
      "Home & Garden",
      "Sports",
      "Toys",
      "Food & Beverage",
      "Beauty"
    ];
    useCartStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-8"><h2 class="text-3xl font-bold text-neutral-900">Filter Products</h2><p class="text-neutral-500 mt-1">${ssrInterpolate(unref(filterStore).filteredProducts.length)} of ${ssrInterpolate(unref(filterStore).products.length)} products</p></div><div class="flex flex-col lg:flex-row gap-8"><aside class="w-full lg:w-64 shrink-0"><div class="bg-surface rounded-[var(--radius-card)] shadow-card p-6 sticky top-24"><h3 class="font-semibold text-neutral-900 mb-4">Filters</h3><div class="mb-6"><label class="text-sm font-medium text-neutral-700 block mb-2">Category</label><select${ssrRenderAttr("value", unref(filterStore).selectedCategory)} class="w-full border border-neutral-200 rounded-[var(--radius-button)] px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-400"><option value="">All Categories</option><!--[-->`);
      ssrRenderList(CATEGORIES, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat)}>${ssrInterpolate(cat)}</option>`);
      });
      _push(`<!--]--></select></div><div class="mb-6"><label class="text-sm font-medium text-neutral-700 block mb-2"> Max Price: $${ssrInterpolate(unref(filterStore).maxPrice)}</label><input type="range" min="0" max="1000" step="10"${ssrRenderAttr("value", unref(filterStore).maxPrice)} class="w-full accent-brand-600"><div class="flex justify-between text-xs text-neutral-400 mt-1"><span>$0</span><span>$1000</span></div></div><div class="mb-6"><label class="text-sm font-medium text-neutral-700 block mb-2"> Min Rating: ${ssrInterpolate(unref(filterStore).minRating.toFixed(1))} \u2605 </label><input type="range" min="0" max="5" step="0.5"${ssrRenderAttr("value", unref(filterStore).minRating)} class="w-full accent-brand-600"><div class="flex justify-between text-xs text-neutral-400 mt-1"><span>0\u2605</span><span>5\u2605</span></div></div><button class="w-full text-sm text-neutral-600 hover:text-brand-600 underline"> Reset all filters </button></div></aside><div class="flex-1">`);
      if (unref(filterStore).loading) {
        _push(`<div class="text-neutral-400 text-center py-16"> Loading products\u2026 </div>`);
      } else if (unref(filterStore).error) {
        _push(`<div class="text-danger font-medium p-4 bg-red-50 rounded-lg">${ssrInterpolate(unref(filterStore).error)}</div>`);
      } else if (unref(filterStore).filteredProducts.length === 0) {
        _push(`<div class="text-neutral-400 text-center py-16"> No products match the current filters. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filterStore).filteredProducts, (product) => {
          _push(`<div class="bg-surface rounded-[var(--radius-card)] shadow-card overflow-hidden">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/products/${product.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[4/3] bg-neutral-100"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  src: product.image_url,
                  alt: product.name,
                  class: "w-full h-full object-cover",
                  width: "400",
                  height: "300",
                  loading: "lazy"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[4/3] bg-neutral-100" }, [
                    createVNode(_component_NuxtImg, {
                      src: product.image_url,
                      alt: product.name,
                      class: "w-full h-full object-cover",
                      width: "400",
                      height: "300",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="p-4"><span class="inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-[var(--radius-badge)] mb-2">${ssrInterpolate(product.category)}</span><h3 class="font-semibold text-neutral-900 text-sm line-clamp-2 mb-1">${ssrInterpolate(product.name)}</h3><div class="flex items-center justify-between mt-2"><span class="font-bold text-neutral-900">$${ssrInterpolate(product.price.toFixed(2))}</span><span class="text-xs text-neutral-500">\u2605 ${ssrInterpolate(product.rating.toFixed(1))}</span></div><button class="mt-3 w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-button)] transition-colors"> Add to Cart </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/filter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=filter-swcP-neh.mjs.map
