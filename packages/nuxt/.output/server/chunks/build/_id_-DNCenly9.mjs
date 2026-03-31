import { _ as __nuxt_component_0 } from './nuxt-link-DOsOLPdi.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-DZJUQzfK.mjs';
import { defineComponent, withAsyncContext, computed, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useRoute$1, u as useRuntimeConfig } from './server.mjs';
import { u as useFetch } from './fetch-CIDs-rRV.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute$1();
    const config = useRuntimeConfig();
    const id = route.params["id"];
    const { data, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/products/${id}`,
      {
        baseURL: config.public.apiUrl
      },
      "$whgyvngmyv"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const product = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.data) != null ? _b : null;
    });
    useCartStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-brand-600 hover:underline text-sm mb-6 inline-block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2190 Back to products `);
          } else {
            return [
              createTextVNode(" \u2190 Back to products ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(error)) {
        _push(`<div class="text-danger font-medium p-4 bg-red-50 rounded-lg"> Error loading product: ${ssrInterpolate(unref(error).message)}</div>`);
      } else if (!unref(product)) {
        _push(`<div class="text-neutral-500 text-center py-16"> Product not found. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-12"><div class="rounded-[var(--radius-card)] overflow-hidden bg-neutral-100 aspect-[4/3]">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(product).image_url,
          alt: unref(product).name,
          class: "w-full h-full object-cover",
          width: "800",
          height: "600"
        }, null, _parent));
        _push(`</div><div class="flex flex-col gap-4"><span class="inline-block text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-[var(--radius-badge)] w-fit">${ssrInterpolate(unref(product).category)}</span><h1 class="text-3xl font-bold text-neutral-900">${ssrInterpolate(unref(product).name)}</h1><p class="text-neutral-600 leading-relaxed">${ssrInterpolate(unref(product).description)}</p><div class="flex items-center gap-4 mt-2"><span class="text-3xl font-bold text-neutral-900">$${ssrInterpolate(unref(product).price.toFixed(2))}</span><span class="text-neutral-500">\u2605 ${ssrInterpolate(unref(product).rating.toFixed(1))} rating</span></div><div class="text-sm text-neutral-500">${ssrInterpolate(unref(product).stock > 0 ? `${unref(product).stock} in stock` : "Out of stock")}</div><div class="flex flex-wrap gap-2 mt-2"><!--[-->`);
        ssrRenderList(unref(product).tags, (tag) => {
          _push(`<span class="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-[var(--radius-badge)]">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div><button${ssrIncludeBooleanAttr(unref(product).stock === 0) ? " disabled" : ""} class="mt-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-[var(--radius-button)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"> Add to Cart </button></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DNCenly9.mjs.map
