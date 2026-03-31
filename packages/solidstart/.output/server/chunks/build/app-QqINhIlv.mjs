import { createComponent, ssr, ssrHydrationKey, escape, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, untrack, Show, on, createRoot } from 'solid-js';
import { S as So, O as Oe, N as Ne, E as Ee, P as Pe, z as ze, T as Te, M, t as te, K as Ke, q as qe, a as V, y as ye, I as Ie } from '../nitro/nitro.mjs';
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

const T = (t) => (r) => {
  const { base: a } = r, n = children(() => r.children), e = createMemo(() => Oe(n(), r.base || ""));
  let i;
  const u = Ne(t, e, () => i, { base: a, singleFlight: r.singleFlight, transformUrl: r.transformUrl });
  return t.create && t.create(u), createComponent(Ee.Provider, { value: u, get children() {
    return createComponent(nt, { routerState: u, get root() {
      return r.root;
    }, get preload() {
      return r.rootPreload || r.rootLoad;
    }, get children() {
      return [(i = getOwner()) && null, createComponent(at, { routerState: u, get branches() {
        return e();
      } })];
    } });
  } });
};
function nt(t) {
  const r = t.routerState.location, a = t.routerState.params, n = createMemo(() => t.preload && untrack(() => {
    Ke(true), t.preload({ params: a, location: r, intent: ze() || "initial" }), Ke(false);
  }));
  return createComponent(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (e) => createComponent(e, { params: a, location: r, get data() {
    return n();
  }, get children() {
    return t.children;
  } }) });
}
function at(t) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      ot(e, t.routerState, t.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = t.routerState.matches().map(({ route: i, path: u, params: m }) => ({ path: i.originalPath, pattern: i.pattern, match: u, params: m, info: i.info }))));
  }
  const r = [];
  let a;
  const n = createMemo(on(t.routerState.matches, (e, i, u) => {
    let m = i && e.length === i.length;
    const h = [];
    for (let l = 0, w = e.length; l < w; l++) {
      const b = i && i[l], g = e[l];
      u && b && g.route.key === b.route.key ? h[l] = u[l] : (m = false, r[l] && r[l](), createRoot((y) => {
        r[l] = y, h[l] = Te(t.routerState, h[l - 1] || t.routerState.base, O(() => n()[l + 1]), () => {
          var _a;
          const p = t.routerState.matches();
          return (_a = p[l]) != null ? _a : p[0];
        });
      }));
    }
    return r.splice(e.length).forEach((l) => l()), u && m ? u : (a = h[0], h);
  }));
  return O(() => n() && a)();
}
const O = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (r) => createComponent(te.Provider, { value: r, get children() {
  return r.outlet();
} }) });
function ot(t, r, a) {
  const n = new URL(t.request.url), e = M(a, new URL(t.router.previousUrl || t.request.url).pathname), i = M(a, n.pathname);
  for (let u = 0; u < i.length; u++) {
    (!e[u] || i[u].route !== e[u].route) && (t.router.dataOnly = true);
    const { route: m, params: h } = i[u];
    m.preload && m.preload({ params: h, location: r.location, intent: "preload" });
  }
}
function st([t, r], a, n) {
  return [t, n ? (e) => r(n(e)) : r];
}
function it(t) {
  let r = false;
  const a = (e) => typeof e == "string" ? { value: e } : e, n = st(createSignal(a(t.get()), { equals: (e, i) => e.value === i.value && e.state === i.state }), void 0, (e) => (!r && t.set(e), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), e));
  return t.init && onCleanup(t.init((e = t.get()) => {
    r = true, n[1](a(e)), r = false;
  })), T({ signal: n, create: t.create, utils: t.utils });
}
function ut(t, r, a) {
  return t.addEventListener(r, a), () => t.removeEventListener(r, a);
}
function ct(t, r) {
  const a = t && document.getElementById(t);
  a ? a.scrollIntoView() : r && window.scrollTo(0, 0);
}
function lt(t) {
  const r = new URL(t);
  return r.pathname + r.search;
}
function dt(t) {
  let r;
  const a = { value: t.url || (r = getRequestEvent()) && lt(r.request.url) || "" };
  return T({ signal: [() => a, (n) => Object.assign(a, n)] })(t);
}
const ht = /* @__PURE__ */ new Map();
function mt(t = true, r = false, a = "/_server", n) {
  return (e) => {
    const i = e.base.path(), u = e.navigatorFactory(e.base);
    let m, h;
    function l(o) {
      return o.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function w(o) {
      if (o.defaultPrevented || o.button !== 0 || o.metaKey || o.altKey || o.ctrlKey || o.shiftKey) return;
      const s = o.composedPath().find((E) => E instanceof Node && E.nodeName.toUpperCase() === "A");
      if (!s || r && !s.hasAttribute("link")) return;
      const d = l(s), c = d ? s.href.baseVal : s.href;
      if ((d ? s.target.baseVal : s.target) || !c && !s.hasAttribute("state")) return;
      const v = (s.getAttribute("rel") || "").split(/\s+/);
      if (s.hasAttribute("download") || v && v.includes("external")) return;
      const R = d ? new URL(c, document.baseURI) : new URL(c);
      if (!(R.origin !== window.location.origin || i && R.pathname && !R.pathname.toLowerCase().startsWith(i.toLowerCase()))) return [s, R];
    }
    function b(o) {
      const s = w(o);
      if (!s) return;
      const [d, c] = s, S = e.parsePath(c.pathname + c.search + c.hash), v = d.getAttribute("state");
      o.preventDefault(), u(S, { resolve: false, replace: d.hasAttribute("replace"), scroll: !d.hasAttribute("noscroll"), state: v ? JSON.parse(v) : void 0 });
    }
    function g(o) {
      const s = w(o);
      if (!s) return;
      const [d, c] = s;
      n && (c.pathname = n(c.pathname)), e.preloadRoute(c, d.getAttribute("preload") !== "false");
    }
    function y(o) {
      clearTimeout(m);
      const s = w(o);
      if (!s) return h = null;
      const [d, c] = s;
      h !== d && (n && (c.pathname = n(c.pathname)), m = setTimeout(() => {
        e.preloadRoute(c, d.getAttribute("preload") !== "false"), h = d;
      }, 20));
    }
    function p(o) {
      if (o.defaultPrevented) return;
      let s = o.submitter && o.submitter.hasAttribute("formaction") ? o.submitter.getAttribute("formaction") : o.target.getAttribute("action");
      if (!s) return;
      if (!s.startsWith("https://action/")) {
        const c = new URL(s, Pe);
        if (s = e.parsePath(c.pathname + c.search), !s.startsWith(a)) return;
      }
      if (o.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const d = ht.get(s);
      if (d) {
        o.preventDefault();
        const c = new FormData(o.target, o.submitter);
        d.call({ r: e, f: o.target }, o.target.enctype === "multipart/form-data" ? c : new URLSearchParams(c));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", b), t && (document.addEventListener("mousemove", y, { passive: true }), document.addEventListener("focusin", g, { passive: true }), document.addEventListener("touchstart", g, { passive: true })), document.addEventListener("submit", p), onCleanup(() => {
      document.removeEventListener("click", b), t && (document.removeEventListener("mousemove", y), document.removeEventListener("focusin", g), document.removeEventListener("touchstart", g)), document.removeEventListener("submit", p);
    });
  };
}
function ft(t) {
  if (isServer) return dt(t);
  const r = () => {
    const n = window.location.pathname.replace(/^\/+/, "/") + window.location.search, e = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: n + window.location.hash, state: e };
  }, a = ye();
  return it({ get: r, set({ value: n, replace: e, scroll: i, state: u }) {
    e ? window.history.replaceState(qe(u), "", n) : window.history.pushState(u, "", n), ct(decodeURIComponent(window.location.hash.slice(1)), i), V();
  }, init: (n) => ut(window, "popstate", Ie(n, (e) => {
    if (e) return !a.confirm(e);
    {
      const i = r();
      return !a.confirm(i.value, { state: i.state });
    }
  })), create: mt(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (n) => window.history.go(n), beforeLeave: a } })(t);
}
var gt = ["<nav", ' class="bg-white border-b border-gray-200 shadow-sm"><div class="max-w-7xl mx-auto px-4 py-3 flex gap-6"><a href="/" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Products</a><a href="/filter" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Filter</a><a href="/cart" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Cart</a></div></nav>'], wt = ["<main", ' class="max-w-7xl mx-auto px-4 py-8">', "</main>"];
function Et() {
  return createComponent(ft, { root: (t) => [ssr(gt, ssrHydrationKey()), ssr(wt, ssrHydrationKey(), escape(createComponent(Suspense, { get children() {
    return t.children;
  } })))], get children() {
    return createComponent(So, {});
  } });
}

export { Et as default };
//# sourceMappingURL=app-QqINhIlv.mjs.map
