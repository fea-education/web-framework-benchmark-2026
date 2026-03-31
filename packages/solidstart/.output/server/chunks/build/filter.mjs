import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { createSignal, onMount, createMemo, Show, For } from 'solid-js';
import { A as A$1 } from './components-BSL6Dh_n.mjs';
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
const R = {};
var j = ["<div", ' class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">', "</div>"], E = ["<div", ' class="flex flex-col gap-6 lg:flex-row"><aside class="w-full shrink-0 lg:w-64"><div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 class="text-base font-semibold text-gray-900 mb-4">Filters</h2><div class="mb-6"><h3 class="text-sm font-medium text-gray-700 mb-3">Category</h3><div class="flex flex-col gap-2">', '</div></div><div class="mb-6"><h3 class="text-sm font-medium text-gray-700 mb-3">Price Range</h3><div class="flex flex-col gap-3"><div><label class="text-xs text-gray-500">Min: $<!--$-->', '<!--/--></label><input type="range" min="0"', ' class="w-full accent-blue-600"></div><div><label class="text-xs text-gray-500">Max: $<!--$-->', '<!--/--></label><input type="range" min="0"', ' class="w-full accent-blue-600"></div></div></div><div class="mb-6"><h3 class="text-sm font-medium text-gray-700 mb-3">Min Rating: <!--$-->', '<!--/--></h3><input type="range" min="0" max="5" step="0.5"', ' class="w-full accent-blue-600"><div class="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>5</span></div></div><button class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Reset Filters</button></div></aside><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-4"><p class="text-sm text-gray-500"><!--$-->', "<!--/--> result<!--$-->", "<!--/--></p><select", ' class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="name">Name (A\u2013Z)</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option></select></div><!--$-->', "<!--/--></div></div>"], C = ["<div", '><h1 class="text-3xl font-bold text-gray-900 mb-8">Filter Products</h1><!--$-->', "<!--/--></div>"], S = ["<div", ' class="flex h-64 items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div></div>'], A = ["<div", ' class="rounded-lg bg-red-50 p-6 text-center"><p class="text-sm font-medium text-red-600">Error: <!--$-->', "<!--/--></p></div>"], T = ["<label", ' class="flex items-center gap-2 cursor-pointer"><input type="checkbox"', ' class="h-4 w-4 rounded border-gray-300 text-blue-600"><span class="text-sm text-gray-600">', "</span></label>"], H = ["<div", ' class="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white"><p class="text-sm text-gray-500">No products match your filters.</p></div>'], L = ["<img", ' width="400" height="300" class="w-full h-40 object-cover" loading="lazy">'], I = ["<div", ' class="p-4"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">', '</span><h2 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">', '</h2><div class="mt-2 flex items-center justify-between"><span class="text-base font-bold text-gray-900">$<!--$-->', '<!--/--></span><span class="text-sm text-gray-500">\u2605 <!--$-->', "<!--/--></span></div></div>"];
const B = (_a = R.VITE_API_URL) != null ? _a : "http://localhost:3000", K = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Food & Beverage", "Beauty"];
function D() {
  const [h, b] = createSignal([]), [v, y] = createSignal(true), [p, w] = createSignal(null), [d, z] = createSignal(/* @__PURE__ */ new Set()), [u, G] = createSignal(0), [o, $] = createSignal(1e3), [m, N] = createSignal(0), [x, U] = createSignal("name");
  onMount(async () => {
    try {
      const e = await fetch(`${B}/products`);
      if (!e.ok) throw new Error(`HTTP ${e.status}`);
      const i = await e.json();
      b(i.data);
      const _ = i.data.map((P) => P.price);
      $(Math.ceil(Math.max(..._)));
    } catch (e) {
      w(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      y(false);
    }
  });
  const c = createMemo(() => h().filter((e) => !(d().size > 0 && !d().has(e.category) || e.price < u() || e.price > o() || e.rating < m())).sort((e, i) => {
    switch (x()) {
      case "price-asc":
        return e.price - i.price;
      case "price-desc":
        return i.price - e.price;
      case "rating":
        return i.rating - e.rating;
      default:
        return e.name.localeCompare(i.name);
    }
  }));
  return ssr(C, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return !v();
  }, get fallback() {
    return ssr(S, ssrHydrationKey());
  }, get children() {
    return createComponent(Show, { get when() {
      return !p();
    }, get fallback() {
      return ssr(A, ssrHydrationKey(), escape(p()));
    }, get children() {
      return ssr(E, ssrHydrationKey(), escape(createComponent(For, { each: K, children: (e) => ssr(T, ssrHydrationKey(), ssrAttribute("checked", d().has(e), true), escape(e)) })), escape(u()), ssrAttribute("max", escape(o(), true), false) + ssrAttribute("value", escape(u(), true), false), escape(o()), ssrAttribute("max", escape(o(), true), false) + ssrAttribute("value", escape(o(), true), false), escape(m().toFixed(1)), ssrAttribute("value", escape(m(), true), false), escape(c().length), c().length !== 1 ? "s" : "", ssrAttribute("value", escape(x(), true), false), escape(createComponent(Show, { get when() {
        return c().length > 0;
      }, get fallback() {
        return ssr(H, ssrHydrationKey());
      }, get children() {
        return ssr(j, ssrHydrationKey(), escape(createComponent(For, { get each() {
          return c();
        }, children: (e) => createComponent(A$1, { get href() {
          return `/products/${e.id}`;
        }, class: "block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100", get children() {
          return [ssr(L, ssrHydrationKey() + ssrAttribute("src", escape(e.image_url, true), false) + ssrAttribute("alt", escape(e.name, true), false)), ssr(I, ssrHydrationKey(), escape(e.category), escape(e.name), escape(e.price.toFixed(2)), escape(e.rating.toFixed(1)))];
        } }) })));
      } })));
    } });
  } })));
}

export { D as default };
//# sourceMappingURL=filter.mjs.map
