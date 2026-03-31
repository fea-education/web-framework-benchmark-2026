const load = async ({ fetch }) => {
  const apiUrl = process.env["API_URL"] ?? "http://localhost:3000";
  const res = await fetch(`${apiUrl}/products`);
  const json = await res.json();
  return {
    products: json.data
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B7wBUPLN.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.BLNSLHCD.js","_app/immutable/chunks/CXT7t9t9.js","_app/immutable/chunks/nFgDUpMG.js","_app/immutable/chunks/DMy-Pnuv.js","_app/immutable/chunks/CE1ctUkT.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-CMqEDENF.js.map
