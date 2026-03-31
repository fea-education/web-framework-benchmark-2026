const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.lmNXJHyn.js",app:"_app/immutable/entry/app.BkGmjt9p.js",imports:["_app/immutable/entry/start.lmNXJHyn.js","_app/immutable/chunks/DGl_FRNO.js","_app/immutable/chunks/nFgDUpMG.js","_app/immutable/chunks/6JSrMwYY.js","_app/immutable/entry/app.BkGmjt9p.js","_app/immutable/chunks/nFgDUpMG.js","_app/immutable/chunks/DMy-Pnuv.js","_app/immutable/chunks/CXT7t9t9.js","_app/immutable/chunks/6JSrMwYY.js","_app/immutable/chunks/BgVx2pl-.js","_app/immutable/chunks/L85ogb1P.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-PHFXW0hc.js')),
			__memo(() => import('./chunks/1-CHSYCRRF.js')),
			__memo(() => import('./chunks/2-CMqEDENF.js')),
			__memo(() => import('./chunks/3-DcZgAdXL.js')),
			__memo(() => import('./chunks/4-DolKMv3J.js')),
			__memo(() => import('./chunks/5-WYuoTRhS.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/products",
				pattern: /^\/api\/products\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-ZjkL_IJd.js'))
			},
			{
				id: "/cart",
				pattern: /^\/cart\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/filter",
				pattern: /^\/filter\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/products/[id]",
				pattern: /^\/products\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
