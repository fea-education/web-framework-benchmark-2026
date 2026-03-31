import { _ as __nuxt_component_0 } from './nuxt-link-DOsOLPdi.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-neutral-50" }, _attrs))}><header class="bg-surface shadow-card sticky top-0 z-10"><div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"><h1 class="text-2xl font-bold text-brand-700">`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`BenchShop`);
      } else {
        return [
          createTextVNode("BenchShop")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</h1><nav class="flex gap-6">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-neutral-600 hover:text-brand-600 transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Products`);
      } else {
        return [
          createTextVNode("Products")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/filter",
    class: "text-neutral-600 hover:text-brand-600 transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Filter`);
      } else {
        return [
          createTextVNode("Filter")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/cart",
    class: "text-neutral-600 hover:text-brand-600 transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cart`);
      } else {
        return [
          createTextVNode("Cart")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav></div></header><main class="max-w-7xl mx-auto px-4 py-8">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main><footer class="bg-neutral-900 text-neutral-400 text-sm py-6 mt-16"><div class="max-w-7xl mx-auto px-4 text-center"> \xA9 2026 BenchShop \u2014 Nuxt 3 benchmark app </div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-y3TEQmxo.mjs.map
