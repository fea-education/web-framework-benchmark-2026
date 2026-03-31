import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { U as Ue, V as Ve, Q as Qe } from '../nitro/nitro.mjs';
import { Suspense, Show } from 'solid-js';
import { y as y$1 } from './createAsync-CBz8AaaQ.mjs';
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
const h = {};
var v = ["<div", ' class="flex h-64 items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div></div>'], b = ["<div", ' class="text-center py-16"><h1 class="text-2xl font-bold text-gray-900">Product not found</h1><!--$-->', "<!--/--></div>"], _ = ["<div", ' class="max-w-4xl mx-auto"><!--$-->', '<!--/--><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="rounded-xl overflow-hidden bg-gray-100"><img', ' width="600" height="450" class="w-full h-auto object-cover"></div><div class="flex flex-col gap-4"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">', '</span><h1 class="text-2xl font-bold text-gray-900">', '</h1><p class="text-gray-600 text-sm leading-relaxed">', '</p><div class="flex items-center gap-4"><span class="text-3xl font-bold text-gray-900">$<!--$-->', '<!--/--></span><span class="text-sm text-gray-500">\u2605 <!--$-->', '<!--/--></span></div><div class="flex flex-wrap gap-2 mt-2">', '</div><p class="text-sm font-medium text-gray-700">', "</p></div></div></div>"], y = ["<span", ' class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">', "</span>"], k = ["<span", ' class="text-green-600"><!--$-->', "<!--/--> in stock</span>"], i = ["<span", ' class="text-red-600">Out of stock</span>'];
const w = (_a = h.VITE_API_URL) != null ? _a : "http://localhost:3000", $ = Qe(async (o) => {
  try {
    const a = await fetch(`${w}/products/${o}`);
    return a.ok ? (await a.json()).data : null;
  } catch {
    return null;
  }
}, "src_routes_products_id_tsx--getProduct_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx?pick=default&pick=%24css&tsr-directive-use-server="), P = Ve($, "product");
function C() {
  const o = Ue(), a = y$1(() => P(o.id));
  return createComponent(Suspense, { get fallback() {
    return ssr(v, ssrHydrationKey());
  }, get children() {
    return createComponent(Show, { get when() {
      return a();
    }, get fallback() {
      return ssr(b, ssrHydrationKey(), escape(createComponent(A, { href: "/", class: "mt-4 inline-block text-blue-600 hover:underline", children: "\u2190 Back to products" })));
    }, children: (e) => ssr(_, ssrHydrationKey(), escape(createComponent(A, { href: "/", class: "inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6", children: "\u2190 Back to products" })), ssrAttribute("src", escape(e().image_url, true), false) + ssrAttribute("alt", escape(e().name, true), false), escape(e().category), escape(e().name), escape(e().description), escape(e().price.toFixed(2)), escape(e().rating.toFixed(1)), escape(e().tags.map((d) => ssr(y, ssrHydrationKey(), escape(d)))), e().stock > 0 ? ssr(k, ssrHydrationKey(), escape(e().stock)) : i[0] + ssrHydrationKey() + i[1]) });
  } });
}

export { C as default };
//# sourceMappingURL=_id_.mjs.map
