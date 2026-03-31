import { _ as __nuxt_component_0 } from './nuxt-link-DOsOLPdi.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-DZJUQzfK.mjs';
import { defineComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
import 'pinia';
import './v3-F5hY1FLE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-8"><h2 class="text-3xl font-bold text-neutral-900">Shopping Cart</h2><p class="text-neutral-500 mt-1">${ssrInterpolate(unref(cartStore).totalItems)} item${ssrInterpolate(unref(cartStore).totalItems !== 1 ? "s" : "")}</p></div>`);
      if (unref(cartStore).items.length === 0) {
        _push(`<div class="text-center py-16"><p class="text-neutral-400 text-lg mb-4">Your cart is empty.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-[var(--radius-button)] transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Browse Products `);
            } else {
              return [
                createTextVNode(" Browse Products ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 flex flex-col gap-4"><!--[-->`);
        ssrRenderList(unref(cartStore).items, (item) => {
          _push(`<div class="bg-surface rounded-[var(--radius-card)] shadow-card p-4 flex gap-4"><div class="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0">`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: item.product.image_url,
            alt: item.product.name,
            class: "w-full h-full object-cover",
            width: "96",
            height: "96"
          }, null, _parent));
          _push(`</div><div class="flex-1 min-w-0"><h3 class="font-semibold text-neutral-900 text-sm line-clamp-2">${ssrInterpolate(item.product.name)}</h3><p class="text-xs text-neutral-500 mt-0.5">${ssrInterpolate(item.product.category)}</p><p class="font-bold text-neutral-900 mt-1">$${ssrInterpolate(item.product.price.toFixed(2))}</p></div><div class="flex flex-col items-end justify-between shrink-0"><button class="text-neutral-400 hover:text-danger transition-colors text-sm" aria-label="Remove item"> \u2715 </button><div class="flex items-center gap-2"><button class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-700"> \u2212 </button><span class="w-8 text-center font-medium text-neutral-900">${ssrInterpolate(item.quantity)}</span><button class="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-700"> + </button></div></div></div>`);
        });
        _push(`<!--]--></div><div class="lg:col-span-1"><div class="bg-surface rounded-[var(--radius-card)] shadow-card p-6 sticky top-24"><h3 class="font-semibold text-neutral-900 text-lg mb-4">Order Summary</h3><div class="space-y-3 text-sm text-neutral-600 mb-6"><div class="flex justify-between"><span>Subtotal (${ssrInterpolate(unref(cartStore).totalItems)} items)</span><span class="font-medium text-neutral-900">$${ssrInterpolate(unref(cartStore).totalPrice.toFixed(2))}</span></div><div class="flex justify-between"><span>Shipping</span><span class="text-success font-medium">Free</span></div><div class="border-t border-neutral-200 pt-3 flex justify-between font-bold text-neutral-900 text-base"><span>Total</span><span>$${ssrInterpolate(unref(cartStore).totalPrice.toFixed(2))}</span></div></div><button class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-[var(--radius-button)] transition-colors"> Checkout (demo) </button><button class="w-full mt-2 text-sm text-neutral-500 hover:text-danger underline transition-colors"> Clear cart </button></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cart-B_RdDUsH.mjs.map
