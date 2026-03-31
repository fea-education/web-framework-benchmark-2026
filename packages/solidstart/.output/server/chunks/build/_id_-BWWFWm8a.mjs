import { Q as Qe } from '../nitro/nitro.mjs';
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
import 'solid-js';
import 'solid-js/web';
import 'solid-js/web/storage';

var _a;
const o = {}, s = (_a = o.VITE_API_URL) != null ? _a : "http://localhost:3000", d = Qe(async (r) => {
  try {
    const t = await fetch(`${s}/products/${r}`);
    return t.ok ? (await t.json()).data : null;
  } catch {
    return null;
  }
}, "src_routes_products_id_tsx--getProduct_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx?pick=route&tsr-directive-use-server=");

export { d as getProduct_cache };
//# sourceMappingURL=_id_-BWWFWm8a.mjs.map
