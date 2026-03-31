import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { createSignal, onMount, createMemo, Show, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { A as A$1 } from './components-O97wFynQ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';

var _a;
const _ = {};
var P = ["<span", ' class="text-lg font-normal text-gray-500">(<!--$-->', "<!--/--> item<!--$-->", "<!--/-->)</span>"], j = ["<div", ' class="flex flex-col gap-4">', "</div>"], k = ["<div", ' class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 class="text-base font-semibold text-gray-900 mb-4">Order Summary</h2><div class="flex justify-between text-sm text-gray-600 mb-2"><span>Items (<!--$-->', "<!--/-->)</span><span>$<!--$-->", '<!--/--></span></div><div class="border-t border-gray-200 pt-3 mt-3"><div class="flex justify-between font-bold text-gray-900"><span>Total</span><span>$<!--$-->', '<!--/--></span></div></div><button class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Proceed to Checkout</button></div>'], A = ["<div", ' class="flex flex-col gap-2 max-h-80 overflow-y-auto">', "</div>"], F = ["<div", '><h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart <!--$-->', '<!--/--></h1><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2">', '</div><div class="flex flex-col gap-4"><!--$-->', '<!--/--><div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 class="text-base font-semibold text-gray-900 mb-4">Add Products</h2><!--$-->', "<!--/--></div></div></div></div>"], S = ["<div", ' class="rounded-xl border border-gray-200 bg-white p-8 text-center"><p class="text-gray-500 mb-4">Your cart is empty.</p><!--$-->', "<!--/--></div>"], C = ["<div", ' class="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><img', ' width="96" height="96" class="w-24 h-24 object-cover rounded-lg flex-shrink-0"><div class="flex-1 min-w-0"><h3 class="font-semibold text-gray-900 text-sm line-clamp-2">', '</h3><p class="text-xs text-gray-500 mt-1">', '</p><p class="text-base font-bold text-gray-900 mt-2">$<!--$-->', '<!--/--></p></div><div class="flex flex-col items-end gap-2 flex-shrink-0"><button class="text-xs text-red-500 hover:text-red-700 transition-colors">Remove</button><div class="flex items-center gap-2"><button class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">\u2212</button><span class="text-sm font-medium text-gray-900 w-4 text-center">', '</span><button class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">+</button></div><p class="text-sm font-semibold text-gray-900">$<!--$-->', "<!--/--></p></div></div>"], I = ["<div", ' class="flex h-16 items-center justify-center"><div class="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>'], q = ["<p", ' class="text-sm text-red-600">', "</p>"], E = ["<div", ' class="flex items-center justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0"><div class="flex-1 min-w-0"><p class="text-xs font-medium text-gray-800 line-clamp-1">', '</p><p class="text-xs text-gray-500">$<!--$-->', '<!--/--></p></div><button class="flex-shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors">Add</button></div>'];
const T = (_a = _.VITE_API_URL) != null ? _a : "http://localhost:3000";
function K() {
  const [a, L] = createStore({ items: [] }), [g, b] = createSignal([]), [f, h] = createSignal(true), [c, v] = createSignal(null);
  onMount(async () => {
    try {
      const t = await fetch(`${T}/products`);
      if (!t.ok) throw new Error(`HTTP ${t.status}`);
      const l = await t.json();
      b(l.data);
    } catch (t) {
      v(t instanceof Error ? t.message : "Failed to load products");
    } finally {
      h(false);
    }
  });
  const d = createMemo(() => a.items.reduce((t, l) => t + l.quantity, 0)), u = createMemo(() => a.items.reduce((t, l) => t + l.product.price * l.quantity, 0));
  return ssr(F, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return d() > 0;
  }, get children() {
    return ssr(P, ssrHydrationKey(), escape(d()), d() !== 1 ? "s" : "");
  } })), escape(createComponent(Show, { get when() {
    return a.items.length > 0;
  }, get fallback() {
    return ssr(S, ssrHydrationKey(), escape(createComponent(A$1, { href: "/", class: "inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors", children: "Browse Products" })));
  }, get children() {
    return ssr(j, ssrHydrationKey(), escape(createComponent(For, { get each() {
      return a.items;
    }, children: (t) => ssr(C, ssrHydrationKey(), ssrAttribute("src", escape(t.product.image_url, true), false) + ssrAttribute("alt", escape(t.product.name, true), false), escape(t.product.name), escape(t.product.category), escape(t.product.price.toFixed(2)), escape(t.quantity), escape((t.product.price * t.quantity).toFixed(2))) })));
  } })), escape(createComponent(Show, { get when() {
    return a.items.length > 0;
  }, get children() {
    return ssr(k, ssrHydrationKey(), escape(d()), escape(u().toFixed(2)), escape(u().toFixed(2)));
  } })), escape(createComponent(Show, { get when() {
    return !f();
  }, get fallback() {
    return ssr(I, ssrHydrationKey());
  }, get children() {
    return createComponent(Show, { get when() {
      return !c();
    }, get fallback() {
      return ssr(q, ssrHydrationKey(), escape(c()));
    }, get children() {
      return ssr(A, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return g().slice(0, 20);
      }, children: (t) => ssr(E, ssrHydrationKey(), escape(t.name), escape(t.price.toFixed(2))) })));
    } });
  } })));
}

export { K as default };
//# sourceMappingURL=cart2.mjs.map
