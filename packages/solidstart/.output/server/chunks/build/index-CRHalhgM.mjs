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
const r = {}, o = (_a = r.VITE_API_URL) != null ? _a : "http://localhost:3000", u = Qe(async () => {
  try {
    const t = await fetch(`${o}/products`);
    return t.ok ? (await t.json()).data : [];
  } catch {
    return [];
  }
}, "src_routes_index_tsx--getProducts_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx?pick=route&tsr-directive-use-server=");

export { u as getProducts_cache };
//# sourceMappingURL=index-CRHalhgM.mjs.map
