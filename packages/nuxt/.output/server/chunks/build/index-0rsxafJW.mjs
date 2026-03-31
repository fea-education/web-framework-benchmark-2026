import { _ as __nuxt_component_0 } from './nuxt-link-DOsOLPdi.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-DZJUQzfK.mjs';
import { defineComponent, withAsyncContext, computed, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useRuntimeConfig } from './server.mjs';
import { u as useFetch } from './fetch-CIDs-rRV.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './v3-F5hY1FLE.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const { data, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/products",
      {
        baseURL: config.public.apiUrl
      },
      "$8UeXQ1xhVL"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const products = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.data) != null ? _b : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-8"><h2 class="text-3xl font-bold text-neutral-900">All Products</h2><p class="text-neutral-500 mt-1">${ssrInterpolate(unref(products).length)} products available</p></div>`);
      if (unref(error)) {
        _push(`<div class="text-danger font-medium p-4 bg-red-50 rounded-lg"> Error loading products: ${ssrInterpolate(unref(error).message)}</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: product.id,
            to: `/products/${product.id}`,
            class: "bg-surface rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[4/3] overflow-hidden bg-neutral-100"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  src: product.image_url,
                  alt: product.name,
                  class: "w-full h-full object-cover",
                  width: "400",
                  height: "300",
                  loading: "lazy"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="p-4"${_scopeId}><span class="inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-[var(--radius-badge)] mb-2"${_scopeId}>${ssrInterpolate(product.category)}</span><h3 class="font-semibold text-neutral-900 text-sm line-clamp-2 mb-1"${_scopeId}>${ssrInterpolate(product.name)}</h3><div class="flex items-center justify-between mt-2"${_scopeId}><span class="font-bold text-neutral-900"${_scopeId}>$${ssrInterpolate(product.price.toFixed(2))}</span><span class="text-xs text-neutral-500"${_scopeId}>\u2605 ${ssrInterpolate(product.rating.toFixed(1))}</span></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[4/3] overflow-hidden bg-neutral-100" }, [
                    createVNode(_component_NuxtImg, {
                      src: product.image_url,
                      alt: product.name,
                      class: "w-full h-full object-cover",
                      width: "400",
                      height: "300",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("div", { class: "p-4" }, [
                    createVNode("span", { class: "inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-[var(--radius-badge)] mb-2" }, toDisplayString(product.category), 1),
                    createVNode("h3", { class: "font-semibold text-neutral-900 text-sm line-clamp-2 mb-1" }, toDisplayString(product.name), 1),
                    createVNode("div", { class: "flex items-center justify-between mt-2" }, [
                      createVNode("span", { class: "font-bold text-neutral-900" }, "$" + toDisplayString(product.price.toFixed(2)), 1),
                      createVNode("span", { class: "text-xs text-neutral-500" }, "\u2605 " + toDisplayString(product.rating.toFixed(1)), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0rsxafJW.mjs.map
