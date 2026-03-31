import { error } from '@sveltejs/kit';

const load = async ({ params, fetch }) => {
  const apiUrl = process.env["API_URL"] ?? "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/products/${params.id}`);
    if (!res.ok) {
      error(404, "Product not found");
    }
    const json = await res.json();
    return {
      product: json.data
    };
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) throw e;
    error(503, "Service unavailable");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CJV5TDGV.js')).default;
const server_id = "src/routes/products/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/5.C7-X6RxJ.js","_app/immutable/chunks/CXT7t9t9.js","_app/immutable/chunks/nFgDUpMG.js","_app/immutable/chunks/DMy-Pnuv.js","_app/immutable/chunks/BgVx2pl-.js","_app/immutable/chunks/L85ogb1P.js","_app/immutable/chunks/CE1ctUkT.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-BbxDBGv9.js.map
