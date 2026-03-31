import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { V as Ve, Q as Qe } from '../nitro/nitro.mjs';
import { Suspense, For } from 'solid-js';
import { y } from './createAsync-CBz8AaaQ.mjs';
import { A } from './components-BSL6Dh_n.mjs';
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
const p = {};
var g = ["<div", '><h1 class="text-3xl font-bold text-gray-900 mb-8">All Products</h1><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">', "</div></div>"], f = ["<div", ' class="flex h-64 items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div></div>'], h = ["<img", ' width="400" height="300" class="w-full h-48 object-cover" loading="lazy">'], x = ["<div", ' class="p-4"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">', '</span><h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">', '</h2><div class="mt-2 flex items-center justify-between"><span class="text-lg font-bold text-gray-900">$<!--$-->', '<!--/--></span><span class="text-sm text-gray-500">\u2605 <!--$-->', '<!--/--></span></div><p class="mt-1 text-xs text-gray-400">', "</p></div>"];
const b = (_a = p.VITE_API_URL) != null ? _a : "http://localhost:3000", v = Qe(async () => {
  try {
    const s = await fetch(`${b}/products`);
    return s.ok ? (await s.json()).data : [];
  } catch {
    return [];
  }
}, "src_routes_index_tsx--getProducts_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx?pick=default&pick=%24css&tsr-directive-use-server="), _ = Ve(v, "products");
function R() {
  const s = y(() => _());
  return createComponent(Suspense, { get fallback() {
    return ssr(f, ssrHydrationKey());
  }, get children() {
    return ssr(g, ssrHydrationKey(), escape(createComponent(For, { get each() {
      return s();
    }, children: (e) => createComponent(A, { get href() {
      return `/products/${e.id}`;
    }, class: "block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100", get children() {
      return [ssr(h, ssrHydrationKey() + ssrAttribute("src", escape(e.image_url, true), false) + ssrAttribute("alt", escape(e.name, true), false)), ssr(x, ssrHydrationKey(), escape(e.category), escape(e.name), escape(e.price.toFixed(2)), escape(e.rating.toFixed(1)), e.stock > 0 ? `${escape(e.stock)} in stock` : "Out of stock")];
    } }) })));
  } });
}

export { R as default };
//# sourceMappingURL=index.mjs.map
