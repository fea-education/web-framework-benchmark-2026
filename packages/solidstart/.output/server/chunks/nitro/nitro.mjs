import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createSignal, createMemo, createRenderEffect, on as on$1, useContext, runWithOwner, createContext as createContext$1, getOwner, startTransition, resetErrorBoundaries, batch, untrack, createComponent, getListener, onCleanup, sharedConfig, lazy, catchError, ErrorBoundary, Suspense, children, Show, createRoot } from 'solid-js';
import { isServer, getRequestEvent, renderToString, ssrElement, escape, mergeProps, ssr, renderToStream, createComponent as createComponent$1, ssrHydrationKey, NoHydration, useAssets, Hydration, ssrAttribute, HydrationScript, delegateEvents } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m$1(e._destroy,t._destroy);}};function _$4(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m$1(...n){return function(...e){for(const t of n)t(...e);}}const g$1=_$4();let A$1 = class A extends g$1{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$1 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}};function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E$2=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$2(n={}){const e=new E$2,t=Array.isArray(n)||H$3(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$3(n){return typeof n?.entries=="function"}function v$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$2=new Set([101,204,205,304]);async function b$1(n,e){const t=new y$1,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$2(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$2.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$5(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart","order":0,"outDir":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart","base":"/","outDir":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart","outDir":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"../../node_modules/.pnpm/@solidjs+start@1.3.2_solid-js@1.9.12_vinxi@0.5.11_@types+node@20.19.37_db0@0.3.4_ioredi_33dcd172b419d515db672ac69eb52245/node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart","outDir":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"preset":"node-server"},"root":"/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart"};
					const buildManifest = {"ssr":{"_components-O97wFynQ.js":{"file":"assets/components-O97wFynQ.js","name":"components","imports":["_routing-C2921SEr.js"]},"_createAsync-CBz8AaaQ.js":{"file":"assets/createAsync-CBz8AaaQ.js","name":"createAsync"},"_query-D2qMaVqx.js":{"file":"assets/query-D2qMaVqx.js","name":"query","imports":["_routing-C2921SEr.js"]},"_routing-C2921SEr.js":{"file":"assets/routing-C2921SEr.js","name":"routing"},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"cart.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-O97wFynQ.js","_routing-C2921SEr.js"]},"src/routes/filter.tsx?pick=default&pick=$css":{"file":"filter.js","name":"filter","src":"src/routes/filter.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-O97wFynQ.js","_routing-C2921SEr.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_query-D2qMaVqx.js","_createAsync-CBz8AaaQ.js","_components-O97wFynQ.js","_routing-C2921SEr.js"]},"src/routes/products/[id].tsx?pick=default&pick=$css":{"file":"_id_.js","name":"_id_","src":"src/routes/products/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_query-D2qMaVqx.js","_routing-C2921SEr.js","_createAsync-CBz8AaaQ.js","_components-O97wFynQ.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_query-D2qMaVqx.js","_routing-C2921SEr.js"],"dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/cart.tsx?pick=default&pick=$css","src/routes/filter.tsx?pick=default&pick=$css","src/routes/filter.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/products/[id].tsx?pick=default&pick=$css","src/routes/products/[id].tsx?pick=default&pick=$css"],"css":["assets/ssr-w60-TtWU.css"]}},"client":{"_components-C7HkYVl0.js":{"file":"assets/components-C7HkYVl0.js","name":"components","imports":["_routing-BPmLC6kV.js"]},"_createAsync-BG3nCDOm.js":{"file":"assets/createAsync-BG3nCDOm.js","name":"createAsync","imports":["_routing-BPmLC6kV.js"]},"_routing-BPmLC6kV.js":{"file":"assets/routing-BPmLC6kV.js","name":"routing"},"_server-runtime-DIc5_DvR.js":{"file":"assets/server-runtime-DIc5_DvR.js","name":"server-runtime","imports":["_routing-BPmLC6kV.js"]},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"assets/cart-CU_B0Jck.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-BPmLC6kV.js","_components-C7HkYVl0.js"]},"src/routes/filter.tsx?pick=default&pick=$css":{"file":"assets/filter-CYazGdgj.js","name":"filter","src":"src/routes/filter.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-BPmLC6kV.js","_components-C7HkYVl0.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-B0hPsuzB.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-BPmLC6kV.js","_server-runtime-DIc5_DvR.js","_createAsync-BG3nCDOm.js","_components-C7HkYVl0.js"]},"src/routes/products/[id].tsx?pick=default&pick=$css":{"file":"assets/_id_-C6qcMyTp.js","name":"_id_","src":"src/routes/products/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-BPmLC6kV.js","_server-runtime-DIc5_DvR.js","_createAsync-BG3nCDOm.js","_components-C7HkYVl0.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-C-AFmaFX.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_routing-BPmLC6kV.js","_server-runtime-DIc5_DvR.js"],"dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/filter.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/products/[id].tsx?pick=default&pick=$css"],"css":["assets/client-w60-TtWU.css"]}},"server-fns":{"_components-BSL6Dh_n.js":{"file":"assets/components-BSL6Dh_n.js","name":"components","imports":["_routing-y6NDuN6m.js"]},"_createAsync-CBz8AaaQ.js":{"file":"assets/createAsync-CBz8AaaQ.js","name":"createAsync"},"_query-ADs8Nja7.js":{"file":"assets/query-ADs8Nja7.js","name":"query","imports":["_routing-y6NDuN6m.js"]},"_routing-y6NDuN6m.js":{"file":"assets/routing-y6NDuN6m.js","name":"routing"},"_server-fns-xd-M19Bu.js":{"file":"assets/server-fns-xd-M19Bu.js","name":"server-fns","imports":["_query-ADs8Nja7.js"],"dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/cart.tsx?pick=default&pick=$css","src/routes/filter.tsx?pick=default&pick=$css","src/routes/filter.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/products/[id].tsx?pick=default&pick=$css","src/routes/products/[id].tsx?pick=default&pick=$css","src/routes/index.tsx?pick=route&tsr-directive-use-server=","src/routes/products/[id].tsx?pick=route&tsr-directive-use-server=","src/app.tsx"]},"src/app.tsx":{"file":"assets/app-QqINhIlv.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_server-fns-xd-M19Bu.js","_routing-y6NDuN6m.js","_query-ADs8Nja7.js"],"css":["assets/app-w60-TtWU.css"]},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"cart.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-BSL6Dh_n.js","_routing-y6NDuN6m.js"]},"src/routes/filter.tsx?pick=default&pick=$css":{"file":"filter.js","name":"filter","src":"src/routes/filter.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-BSL6Dh_n.js","_routing-y6NDuN6m.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_query-ADs8Nja7.js","_createAsync-CBz8AaaQ.js","_components-BSL6Dh_n.js","_routing-y6NDuN6m.js"]},"src/routes/index.tsx?pick=route&tsr-directive-use-server=":{"file":"assets/index-CRHalhgM.js","name":"index","src":"src/routes/index.tsx?pick=route&tsr-directive-use-server=","isDynamicEntry":true,"imports":["_query-ADs8Nja7.js","_routing-y6NDuN6m.js"]},"src/routes/products/[id].tsx?pick=default&pick=$css":{"file":"_id_.js","name":"_id_","src":"src/routes/products/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_query-ADs8Nja7.js","_routing-y6NDuN6m.js","_createAsync-CBz8AaaQ.js","_components-BSL6Dh_n.js"]},"src/routes/products/[id].tsx?pick=route&tsr-directive-use-server=":{"file":"assets/_id_-BWWFWm8a.js","name":"_id_","src":"src/routes/products/[id].tsx?pick=route&tsr-directive-use-server=","isDynamicEntry":true,"imports":["_query-ADs8Nja7.js","_routing-y6NDuN6m.js"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-xd-M19Bu.js","_query-ADs8Nja7.js","_routing-y6NDuN6m.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/assets/ssr-w60-TtWU.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"41c3-UDONTavMThaJUjOuarXB3rOTWDI\"",
    "mtime": "2026-03-31T23:47:49.292Z",
    "size": 16835,
    "path": "../public/assets/ssr-w60-TtWU.css"
  },
  "/assets/ssr-w60-TtWU.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"dd5-hcFFv8DMPuVFuCGHfVMlubeHUP4\"",
    "mtime": "2026-03-31T23:47:49.350Z",
    "size": 3541,
    "path": "../public/assets/ssr-w60-TtWU.css.br"
  },
  "/assets/ssr-w60-TtWU.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"102e-Qsdlioob5dW4vgizmhpdyCSH3hU\"",
    "mtime": "2026-03-31T23:47:49.335Z",
    "size": 4142,
    "path": "../public/assets/ssr-w60-TtWU.css.gz"
  },
  "/_server/assets/app-w60-TtWU.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"dd5-hcFFv8DMPuVFuCGHfVMlubeHUP4\"",
    "mtime": "2026-03-31T23:47:49.350Z",
    "size": 3541,
    "path": "../public/_server/assets/app-w60-TtWU.css.br"
  },
  "/_server/assets/app-w60-TtWU.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"41c3-UDONTavMThaJUjOuarXB3rOTWDI\"",
    "mtime": "2026-03-31T23:47:49.320Z",
    "size": 16835,
    "path": "../public/_server/assets/app-w60-TtWU.css"
  },
  "/_server/assets/app-w60-TtWU.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"102e-Qsdlioob5dW4vgizmhpdyCSH3hU\"",
    "mtime": "2026-03-31T23:47:49.335Z",
    "size": 4142,
    "path": "../public/_server/assets/app-w60-TtWU.css.gz"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"9f3-cSmLcgdAicej/MTaAYdzftLaaZo\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 2547,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"1ac-+/fBkH9OMoCxaeuxS+0mKtIFAiU\"",
    "mtime": "2026-03-31T23:47:49.355Z",
    "size": 428,
    "path": "../public/_build/.vite/manifest.json.br"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"1ec-95kNMKRW6F1U74ckpFRe5UsAD74\"",
    "mtime": "2026-03-31T23:47:49.350Z",
    "size": 492,
    "path": "../public/_build/.vite/manifest.json.gz"
  },
  "/_build/assets/_id_-C6qcMyTp.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"bd7-wHD+uKR1isIHp0Lf33ZkD4e0mYY\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 3031,
    "path": "../public/_build/assets/_id_-C6qcMyTp.js"
  },
  "/_build/assets/_id_-C6qcMyTp.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"4a4-l5oSfICHBzXFBQYroCvoY+hFKPs\"",
    "mtime": "2026-03-31T23:47:49.360Z",
    "size": 1188,
    "path": "../public/_build/assets/_id_-C6qcMyTp.js.br"
  },
  "/_build/assets/_id_-C6qcMyTp.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"558-wKKjnkmyP2icEzq8DVaVR5YnlYE\"",
    "mtime": "2026-03-31T23:47:49.358Z",
    "size": 1368,
    "path": "../public/_build/assets/_id_-C6qcMyTp.js.gz"
  },
  "/_build/assets/cart-CU_B0Jck.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"d32-d705PL3joaw7xXzzr/8vCg5UTTs\"",
    "mtime": "2026-03-31T23:47:49.370Z",
    "size": 3378,
    "path": "../public/_build/assets/cart-CU_B0Jck.js.br"
  },
  "/_build/assets/cart-CU_B0Jck.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"27b3-Ff0NSRNimAwPsg1Zsro+J3LOHmA\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 10163,
    "path": "../public/_build/assets/cart-CU_B0Jck.js"
  },
  "/_build/assets/cart-CU_B0Jck.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"eae-jVNYRgD3jb+zeNSW4W45HyZ+/bM\"",
    "mtime": "2026-03-31T23:47:49.360Z",
    "size": 3758,
    "path": "../public/_build/assets/cart-CU_B0Jck.js.gz"
  },
  "/_build/assets/client-C-AFmaFX.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1719-m6qu7MNssI6NpTbplmklSCvarxQ\"",
    "mtime": "2026-03-31T23:47:49.373Z",
    "size": 5913,
    "path": "../public/_build/assets/client-C-AFmaFX.js.br"
  },
  "/_build/assets/client-C-AFmaFX.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"423d-BC1ddnrYwfH5wXVIomn9r/dJKBw\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 16957,
    "path": "../public/_build/assets/client-C-AFmaFX.js"
  },
  "/_build/assets/client-C-AFmaFX.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"19d4-AjV2v95HP1LRedJRYkWVJsDY9Wc\"",
    "mtime": "2026-03-31T23:47:49.360Z",
    "size": 6612,
    "path": "../public/_build/assets/client-C-AFmaFX.js.gz"
  },
  "/_build/assets/client-w60-TtWU.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"41c3-UDONTavMThaJUjOuarXB3rOTWDI\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 16835,
    "path": "../public/_build/assets/client-w60-TtWU.css"
  },
  "/_build/assets/client-w60-TtWU.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"dd5-hcFFv8DMPuVFuCGHfVMlubeHUP4\"",
    "mtime": "2026-03-31T23:47:49.424Z",
    "size": 3541,
    "path": "../public/_build/assets/client-w60-TtWU.css.br"
  },
  "/_build/assets/client-w60-TtWU.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"102e-Qsdlioob5dW4vgizmhpdyCSH3hU\"",
    "mtime": "2026-03-31T23:47:49.370Z",
    "size": 4142,
    "path": "../public/_build/assets/client-w60-TtWU.css.gz"
  },
  "/_build/assets/components-C7HkYVl0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"331-Z0eCcZAw2AdqQtH0vmC0XYGhSho\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 817,
    "path": "../public/_build/assets/components-C7HkYVl0.js"
  },
  "/_build/assets/createAsync-BG3nCDOm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"29b-WIR9TE4kIETEitwvP/9xkoh31ug\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 667,
    "path": "../public/_build/assets/createAsync-BG3nCDOm.js"
  },
  "/_build/assets/filter-CYazGdgj.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1a70-C6lziUIYpNiMVpwP/hVNJHUgXtU\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 6768,
    "path": "../public/_build/assets/filter-CYazGdgj.js"
  },
  "/_build/assets/filter-CYazGdgj.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"926-p6gxeag70yzRO7mHUuczPmdRF0M\"",
    "mtime": "2026-03-31T23:47:49.424Z",
    "size": 2342,
    "path": "../public/_build/assets/filter-CYazGdgj.js.br"
  },
  "/_build/assets/filter-CYazGdgj.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a77-d4vnl/SKhVm+8pTpFI6bm0fk3M0\"",
    "mtime": "2026-03-31T23:47:49.373Z",
    "size": 2679,
    "path": "../public/_build/assets/filter-CYazGdgj.js.gz"
  },
  "/_build/assets/index-B0hPsuzB.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"8d0-K/guZt0dRTZdXn9Qdw2qaW2JQJo\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 2256,
    "path": "../public/_build/assets/index-B0hPsuzB.js"
  },
  "/_build/assets/index-B0hPsuzB.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4a9-Nw34IjQhgWETwtAS54Hc5XzlcJ8\"",
    "mtime": "2026-03-31T23:47:49.423Z",
    "size": 1193,
    "path": "../public/_build/assets/index-B0hPsuzB.js.gz"
  },
  "/_build/assets/routing-BPmLC6kV.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"854b-BoLctnE9V9fvAddCvbwLtOcTJG4\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 34123,
    "path": "../public/_build/assets/routing-BPmLC6kV.js"
  },
  "/_build/assets/index-B0hPsuzB.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"406-54b1fkF7qccaBM3x63nIa6A3Znk\"",
    "mtime": "2026-03-31T23:47:49.423Z",
    "size": 1030,
    "path": "../public/_build/assets/index-B0hPsuzB.js.br"
  },
  "/_build/assets/routing-BPmLC6kV.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2f6f-+WTlnATfZooNjseLSni9cPKbCXo\"",
    "mtime": "2026-03-31T23:47:49.498Z",
    "size": 12143,
    "path": "../public/_build/assets/routing-BPmLC6kV.js.br"
  },
  "/_build/assets/routing-BPmLC6kV.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"341d-eAjfQUpLRELLK1AdEiHwQ8df1VE\"",
    "mtime": "2026-03-31T23:47:49.423Z",
    "size": 13341,
    "path": "../public/_build/assets/routing-BPmLC6kV.js.gz"
  },
  "/_build/assets/server-runtime-DIc5_DvR.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1a7f-/BMX8fP6Cjt+mYhtwHkKH7TFC9o\"",
    "mtime": "2026-03-31T23:47:49.470Z",
    "size": 6783,
    "path": "../public/_build/assets/server-runtime-DIc5_DvR.js.br"
  },
  "/_build/assets/server-runtime-DIc5_DvR.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"5e45-s6RyKU14L+yP8apL9oyocNUo9UI\"",
    "mtime": "2026-03-31T23:47:49.315Z",
    "size": 24133,
    "path": "../public/_build/assets/server-runtime-DIc5_DvR.js"
  },
  "/_build/assets/server-runtime-DIc5_DvR.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1d7c-PRqvfILtgcDHAormn3X7TLYvDiE\"",
    "mtime": "2026-03-31T23:47:49.424Z",
    "size": 7548,
    "path": "../public/_build/assets/server-runtime-DIc5_DvR.js.gz"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _CTCgq4 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

function ye$4() {
  let t = /* @__PURE__ */ new Set();
  function e(r) {
    return t.add(r), () => t.delete(r);
  }
  let n = false;
  function s(r, o) {
    if (n) return !(n = false);
    const a = { to: r, options: o, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const c of t) c.listener({ ...a, from: c.location, retry: (f) => {
      f && (n = true), c.navigate(r, { ...o, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: e, confirm: s };
}
let D$3;
function V$2() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), D$3 = window.history.state._depth;
}
isServer || V$2();
function qe$5(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function Ie$4(t, e) {
  let n = false;
  return () => {
    const s = D$3;
    V$2();
    const r = s == null ? null : D$3 - s;
    if (n) {
      n = false;
      return;
    }
    r && e(r) ? (n = true, window.history.go(-r)) : t();
  };
}
const we$4 = /^(?:[a-z0-9]+:)?\/\//i, ve$4 = /^\/+|(\/)\/+$/g, Pe$4 = "http://sr";
function F$4(t, e = false) {
  const n = t.replace(ve$4, "$1");
  return n ? e || /^[?#]/.test(n) ? n : "/" + n : "";
}
function W$3(t, e, n) {
  if (we$4.test(e)) return;
  const s = F$4(t), r = n && F$4(n);
  let o = "";
  return !r || e.startsWith("/") ? o = s : r.toLowerCase().indexOf(s.toLowerCase()) !== 0 ? o = s + r : o = r, (o || "/") + F$4(e, !o);
}
function Re$4(t, e) {
  if (t == null) throw new Error(e);
  return t;
}
function xe$4(t, e) {
  return F$4(t).replace(/\/*(\*.*)?$/g, "") + F$4(e);
}
function Y$3(t) {
  const e = {};
  return t.searchParams.forEach((n, s) => {
    s in e ? Array.isArray(e[s]) ? e[s].push(n) : e[s] = [e[s], n] : e[s] = n;
  }), e;
}
function be$4(t, e, n) {
  const [s, r] = t.split("/*", 2), o = s.split("/").filter(Boolean), a = o.length;
  return (c) => {
    const f = c.split("/").filter(Boolean), h = f.length - a;
    if (h < 0 || h > 0 && r === void 0 && !e) return null;
    const l = { path: a ? "" : "/", params: {} }, m = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < a; d++) {
      const p = o[d], y = p[0] === ":", v = y ? f[d] : f[d].toLowerCase(), E = y ? p.slice(1) : p.toLowerCase();
      if (y && $$3(v, m(E))) l.params[E] = v;
      else if (y || !$$3(v, E)) return null;
      l.path += `/${v}`;
    }
    if (r) {
      const d = h ? f.slice(-h).join("/") : "";
      if ($$3(d, m(r))) l.params[r] = d;
      else return null;
    }
    return l;
  };
}
function $$3(t, e) {
  const n = (s) => s === t;
  return e === void 0 ? true : typeof e == "string" ? n(e) : typeof e == "function" ? e(t) : Array.isArray(e) ? e.some(n) : e instanceof RegExp ? e.test(t) : false;
}
function Ae$4(t) {
  const [e, n] = t.pattern.split("/*", 2), s = e.split("/").filter(Boolean);
  return s.reduce((r, o) => r + (o.startsWith(":") ? 2 : 3), s.length - (n === void 0 ? 0 : 1));
}
function Z$3(t) {
  const e = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(s, r) {
    return e.has(r) || runWithOwner(n, () => e.set(r, createMemo(() => t()[r]))), e.get(r)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(t());
  }, has(s, r) {
    return r in t();
  } });
}
function ee$2(t) {
  let e = /(\/?\:[^\/]+)\?/.exec(t);
  if (!e) return [t];
  let n = t.slice(0, e.index), s = t.slice(e.index + e[0].length);
  const r = [n, n += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(s); ) r.push(n += e[1]), s = s.slice(e[0].length);
  return ee$2(s).reduce((o, a) => [...o, ...r.map((c) => c + a)], []);
}
const Ce$4 = 100, Ee$4 = createContext$1(), te$2 = createContext$1(), L$4 = () => Re$4(useContext(Ee$4), "<A> and 'use' router primitives can be only used inside a Route."), Fe$3 = () => useContext(te$2) || L$4().base, We$3 = (t) => {
  const e = Fe$3();
  return createMemo(() => e.resolvePath(t()));
}, $e$4 = (t) => {
  const e = L$4();
  return createMemo(() => {
    const n = t();
    return n !== void 0 ? e.renderPath(n) : n;
  });
}, Me$3 = () => L$4().navigatorFactory(), De$2 = () => L$4().location, Ue$2 = () => L$4().params;
function Le$3(t, e = "") {
  const { component: n, preload: s, load: r, children: o, info: a } = t, c = !o || Array.isArray(o) && !o.length, f = { key: t, component: n, preload: s || r, info: a };
  return ne$2(t.path).reduce((h, l) => {
    for (const m of ee$2(l)) {
      const d = xe$4(e, m);
      let p = c ? d : d.split("/*", 1)[0];
      p = p.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), h.push({ ...f, originalPath: l, pattern: p, matcher: be$4(p, !c, t.matchFilters) });
    }
    return h;
  }, []);
}
function Se$4(t, e = 0) {
  return { routes: t, score: Ae$4(t[t.length - 1]) * 1e4 - e, matcher(n) {
    const s = [];
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r], a = o.matcher(n);
      if (!a) return null;
      s.unshift({ ...a, route: o });
    }
    return s;
  } };
}
function ne$2(t) {
  return Array.isArray(t) ? t : [t];
}
function Oe$4(t, e = "", n = [], s = []) {
  const r = ne$2(t);
  for (let o = 0, a = r.length; o < a; o++) {
    const c = r[o];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const f = Le$3(c, e);
      for (const h of f) {
        n.push(h);
        const l = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !l) Oe$4(c.children, h.pattern, n, s);
        else {
          const m = Se$4([...n], s.length);
          s.push(m);
        }
        n.pop();
      }
    }
  }
  return n.length ? s : s.sort((o, a) => a.score - o.score);
}
function M$4(t, e) {
  for (let n = 0, s = t.length; n < s; n++) {
    const r = t[n].matcher(e);
    if (r) return r;
  }
  return [];
}
function _e$4(t, e, n) {
  const s = new URL(Pe$4), r = createMemo((l) => {
    const m = t();
    try {
      return new URL(m, s);
    } catch {
      return console.error(`Invalid path ${m}`), l;
    }
  }, s, { equals: (l, m) => l.href === m.href }), o = createMemo(() => r().pathname), a = createMemo(() => r().search, true), c = createMemo(() => r().hash), f = () => "", h = on$1(a, () => Y$3(r()));
  return { get pathname() {
    return o();
  }, get search() {
    return a();
  }, get hash() {
    return c();
  }, get state() {
    return e();
  }, get key() {
    return f();
  }, query: n ? n(h) : Z$3(h) };
}
let P$4;
function ze$5() {
  return P$4;
}
let C$4 = false;
function He$5() {
  return C$4;
}
function Ke$5(t) {
  C$4 = t;
}
function Ne$2(t, e, n, s = {}) {
  const { signal: [r, o], utils: a = {} } = t, c = a.parsePath || ((i) => i), f = a.renderPath || ((i) => i), h = a.beforeLeave || ye$4(), l = W$3("", s.base || "");
  if (l === void 0) throw new Error(`${l} is not a valid base path`);
  l && !r().value && o({ value: l, replace: true, scroll: false });
  const [m, d] = createSignal(false);
  let p;
  const y = (i, u) => {
    u.value === v() && u.state === S() || (p === void 0 && d(true), P$4 = i, p = u, startTransition(() => {
      p === u && (E(p.value), re(p.state), resetErrorBoundaries(), isServer || z[1]((g) => g.filter((R) => R.pending)));
    }).finally(() => {
      p === u && batch(() => {
        P$4 = void 0, i === "navigate" && ie(p), d(false), p = void 0;
      });
    }));
  }, [v, E] = createSignal(r().value), [S, re] = createSignal(r().state), O = _e$4(v, S, a.queryWrapper), _ = [], z = createSignal(isServer ? ue() : []), H = createMemo(() => typeof s.transformUrl == "function" ? M$4(e(), s.transformUrl(O.pathname)) : M$4(e(), O.pathname)), K = () => {
    const i = H(), u = {};
    for (let g = 0; g < i.length; g++) Object.assign(u, i[g].params);
    return u;
  }, se = a.paramsWrapper ? a.paramsWrapper(K, e) : Z$3(K), N = { pattern: l, path: () => l, outlet: () => null, resolvePath(i) {
    return W$3(l, i);
  } };
  return createRenderEffect(on$1(r, (i) => y("native", i), { defer: true })), { base: N, location: O, params: se, isRouting: m, renderPath: f, parsePath: c, navigatorFactory: ae, matches: H, beforeLeave: h, preloadRoute: ce, singleFlight: s.singleFlight === void 0 ? true : s.singleFlight, submissions: z };
  function oe(i, u, g) {
    untrack(() => {
      if (typeof u == "number") {
        u && (a.go ? a.go(u) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const R = !u || u[0] === "?", { replace: j, resolve: x, scroll: B, state: b } = { replace: false, resolve: !R, scroll: true, ...g }, A = x ? i.resolvePath(u) : W$3(R && O.pathname || "", u);
      if (A === void 0) throw new Error(`Path '${u}' is not a routable path`);
      if (_.length >= Ce$4) throw new Error("Too many redirects");
      const T = v();
      if (A !== T || b !== S()) if (isServer) {
        const k = getRequestEvent();
        k && (k.response = { status: 302, headers: new Headers({ Location: A }) }), o({ value: A, replace: j, scroll: B, state: b });
      } else h.confirm(A, g) && (_.push({ value: T, replace: j, scroll: B, state: S() }), y("navigate", { value: A, state: b }));
    });
  }
  function ae(i) {
    return i = i || useContext(te$2) || N, (u, g) => oe(i, u, g);
  }
  function ie(i) {
    const u = _[0];
    u && (o({ ...i, replace: u.replace, scroll: u.scroll }), _.length = 0);
  }
  function ce(i, u) {
    const g = M$4(e(), i.pathname), R = P$4;
    P$4 = "preload";
    for (let j in g) {
      const { route: x, params: B } = g[j];
      x.component && x.component.preload && x.component.preload();
      const { preload: b } = x;
      C$4 = true, u && b && runWithOwner(n(), () => b({ params: B, location: { pathname: i.pathname, search: i.search, hash: i.hash, query: Y$3(i), state: null, key: "" }, intent: "preload" })), C$4 = false;
    }
    P$4 = R;
  }
  function ue() {
    const i = getRequestEvent();
    return i && i.router && i.router.submission ? [i.router.submission] : [];
  }
}
function Te$4(t, e, n, s) {
  const { base: r, location: o, params: a } = t, { pattern: c, component: f, preload: h } = s().route, l = createMemo(() => s().path);
  f && f.preload && f.preload(), C$4 = true;
  const m = h ? h({ params: a, location: o, intent: P$4 || "initial" }) : void 0;
  return C$4 = false, { parent: e, pattern: c, path: l, outlet: () => f ? createComponent(f, { params: a, location: o, data: m, get children() {
    return n();
  } }) : n(), resolvePath(p) {
    return W$3(r.path(), p, l());
  } };
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
function pe$2(t = {}) {
  let e, n = false;
  const o = (r) => {
    if (e && e !== r) throw new Error("Context conflict");
  };
  let a;
  if (t.asyncContext) {
    const r = t.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    r ? a = new r() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const i = () => {
    if (a) {
      const r = a.getStore();
      if (r !== void 0) return r;
    }
    return e;
  };
  return { use: () => {
    const r = i();
    if (r === void 0) throw new Error("Context is not available");
    return r;
  }, tryUse: () => i(), set: (r, p) => {
    p || o(r), e = r, n = true;
  }, unset: () => {
    e = void 0, n = false;
  }, call: (r, p) => {
    o(r), e = r;
    try {
      return a ? a.run(r, p) : p();
    } finally {
      n || (e = void 0);
    }
  }, async callAsync(r, p) {
    e = r;
    const y = () => {
      e = r;
    }, R = () => e === r ? y : void 0;
    L$3.add(R);
    try {
      const f = a ? a.run(r, p) : p();
      return n || (e = void 0), await f;
    } finally {
      L$3.delete(R);
    }
  } };
}
function he$2(t = {}) {
  const e = {};
  return { get(n, o = {}) {
    return e[n] || (e[n] = pe$2({ ...t, ...o })), e[n];
  } };
}
const H$2 = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, $$2 = "__unctx__", ge$2 = H$2[$$2] || (H$2[$$2] = he$2()), ye$3 = (t, e = {}) => ge$2.get(t, e), P$3 = "__unctx_async_handlers__", L$3 = H$2[P$3] || (H$2[P$3] = /* @__PURE__ */ new Set());
function Re$3(t) {
  let e;
  const n = N$2(t), o = { duplex: "half", method: t.method, headers: t.headers };
  return t.node.req.body instanceof ArrayBuffer ? new Request(n, { ...o, body: t.node.req.body }) : new Request(n, { ...o, get body() {
    return e || (e = Ce$3(t), e);
  } });
}
function me$2(t) {
  var _a;
  return (_a = t.web) != null ? _a : t.web = { request: Re$3(t), url: N$2(t) }, t.web.request;
}
function we$3() {
  return _e$3();
}
const M$3 = /* @__PURE__ */ Symbol("$HTTPEvent");
function be$3(t) {
  return typeof t == "object" && (t instanceof H3Event || (t == null ? void 0 : t[M$3]) instanceof H3Event || (t == null ? void 0 : t.__is_event__) === true);
}
function u$1(t) {
  return function(...e) {
    var _a;
    let n = e[0];
    if (be$3(n)) e[0] = n instanceof H3Event || n.__is_event__ ? n : n[M$3];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (n = we$3(), !n) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      e.unshift(n);
    }
    return t(...e);
  };
}
const N$2 = u$1(getRequestURL), xe$3 = u$1(getRequestIP), I$2 = u$1(setResponseStatus), U$2 = u$1(getResponseStatus), Se$3 = u$1(getResponseStatusText), C$3 = u$1(getResponseHeaders), j$2 = u$1(getResponseHeader), ve$3 = u$1(setResponseHeader), D$2 = u$1(appendResponseHeader), Ke$4 = u$1(parseCookies), Be$3 = u$1(getCookie), Ge$3 = u$1(setCookie), ze$4 = u$1(setHeader), Ce$3 = u$1(getRequestWebStream), He$4 = u$1(removeResponseHeader), Ee$3 = u$1(me$2);
function Te$3() {
  var _a;
  return ye$3("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function _e$3() {
  return Te$3().use().event;
}
const _$3 = "solidFetchEvent";
function Ae$3(t) {
  return { request: Ee$3(t), response: Oe$3(t), clientAddress: xe$3(t), locals: {}, nativeEvent: t };
}
function qe$4(t) {
  return { ...t };
}
function Je$3(t) {
  if (!t.context[_$3]) {
    const e = Ae$3(t);
    t.context[_$3] = e;
  }
  return t.context[_$3];
}
function Ye$3(t, e) {
  for (const [n, o] of e.entries()) D$2(t, n, o);
}
let ke$2 = class ke {
  constructor(e) {
    __publicField$2(this, "event");
    this.event = e;
  }
  get(e) {
    const n = j$2(this.event, e);
    return Array.isArray(n) ? n.join(", ") : n || null;
  }
  has(e) {
    return this.get(e) !== null;
  }
  set(e, n) {
    return ve$3(this.event, e, n);
  }
  delete(e) {
    return He$4(this.event, e);
  }
  append(e, n) {
    D$2(this.event, e, n);
  }
  getSetCookie() {
    const e = j$2(this.event, "Set-Cookie");
    return Array.isArray(e) ? e : [e];
  }
  forEach(e) {
    return Object.entries(C$3(this.event)).forEach(([n, o]) => e(Array.isArray(o) ? o.join(", ") : o, n, this));
  }
  entries() {
    return Object.entries(C$3(this.event)).map(([e, n]) => [e, Array.isArray(n) ? n.join(", ") : n])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(C$3(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(C$3(this.event)).map((e) => Array.isArray(e) ? e.join(", ") : e)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
};
function Oe$3(t) {
  return { get status() {
    return U$2(t);
  }, set status(e) {
    I$2(t, e);
  }, get statusText() {
    return Se$3(t);
  }, set statusText(e) {
    I$2(t, U$2(t), e);
  }, headers: new ke$2(t) };
}
function Qe$3(t, e, n) {
  if (typeof t != "function") throw new Error("Export from a 'use server' module must be a function");
  const o = "";
  return new Proxy(t, { get(a, i, r) {
    return i === "url" ? `${o}/_server?id=${encodeURIComponent(e)}&name=${encodeURIComponent(n)}` : i === "GET" ? r : a[i];
  }, apply(a, i, r) {
    const p = getRequestEvent();
    if (!p) throw new Error("Cannot call server function outside of a request");
    const y = qe$4(p);
    return y.locals.serverFunctionMeta = { id: e + "#" + n }, y.serverOnly = true, provideRequestEvent(y, () => t.apply(i, r));
  } });
}
const $e$3 = "Location", Pe$3 = 5e3, Le$2 = 18e4;
let q$3 = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const t = Date.now();
  for (let [e, n] of q$3.entries()) !n[4].count && t - n[0] > Le$2 && q$3.delete(e);
}, 3e5);
function x$2() {
  if (!isServer) return q$3;
  const t = getRequestEvent();
  if (!t) throw new Error("Cannot find cache context");
  return (t.router || (t.router = {})).cache || (t.router.cache = /* @__PURE__ */ new Map());
}
function S$1(t, e) {
  t.GET && (t = t.GET);
  const n = (...o) => {
    const a = x$2(), i = ze$5(), r = He$5(), y = getOwner() ? Me$3() : void 0, R = Date.now(), f = e + F$3(o);
    let s = a.get(f), E;
    if (isServer) {
      const c = getRequestEvent();
      if (c) {
        const d = (c.router || (c.router = {})).dataOnly;
        if (d) {
          const g = c && (c.router.data || (c.router.data = {}));
          if (g && f in g) return g[f];
          if (Array.isArray(d) && !Ie$3(f, d)) return g[f] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (E = true, onCleanup(() => s[4].count--)), s && s[0] && (isServer || i === "native" || s[4].count || Date.now() - s[0] < Pe$3)) {
      E && (s[4].count++, s[4][0]()), s[3] === "preload" && i !== "preload" && (s[0] = R);
      let c = s[1];
      return i !== "preload" && (c = "then" in s[1] ? s[1].then(w(false), w(true)) : w(false)(s[1]), !isServer && i === "navigate" && startTransition(() => s[4][1](s[0]))), r && "then" in c && c.catch(() => {
      }), c;
    }
    let l;
    if (!isServer && sharedConfig.has && sharedConfig.has(f) ? (l = sharedConfig.load(f), delete globalThis._$HY.r[f]) : l = t(...o), s ? (s[0] = R, s[1] = l, s[3] = i, !isServer && i === "navigate" && startTransition(() => s[4][1](s[0]))) : (a.set(f, s = [R, l, , i, createSignal(R)]), s[4].count = 0), E && (s[4].count++, s[4][0]()), isServer) {
      const c = getRequestEvent();
      if (c && c.router.dataOnly) return c.router.data[f] = l;
    }
    if (i !== "preload" && (l = "then" in l ? l.then(w(false), w(true)) : w(false)(l)), r && "then" in l && l.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const c = getRequestEvent();
      (!c || !c.serverOnly) && sharedConfig.context.serialize(f, l);
    }
    return l;
    function w(c) {
      return async (d) => {
        if (d instanceof Response) {
          const g = getRequestEvent();
          if (g) for (const [k, O] of d.headers) k == "set-cookie" ? g.response.headers.append("set-cookie", O) : g.response.headers.set(k, O);
          const v = d.headers.get($e$3);
          if (v !== null) {
            y && v.startsWith("/") ? startTransition(() => {
              y(v, { replace: true });
            }) : isServer ? g && (g.response.status = 302) : window.location.href = v;
            return;
          }
          d.customBody && (d = await d.customBody());
        }
        if (c) throw d;
        return s[2] = d, d;
      };
    }
  };
  return n.keyFor = (...o) => e + F$3(o), n.key = e, n;
}
S$1.get = (t) => x$2().get(t)[2];
S$1.set = (t, e) => {
  const n = x$2(), o = Date.now();
  let a = n.get(t);
  a ? (a[0] = o, a[1] = Promise.resolve(e), a[2] = e, a[3] = "preload") : (n.set(t, a = [o, Promise.resolve(e), e, "preload", createSignal(o)]), a[4].count = 0);
};
S$1.delete = (t) => x$2().delete(t);
S$1.clear = () => x$2().clear();
const Ve$2 = S$1;
function Ie$3(t, e) {
  for (let n of e) if (n && t.startsWith(n)) return true;
  return false;
}
function F$3(t) {
  return JSON.stringify(t, (e, n) => Ue$1(n) ? Object.keys(n).sort().reduce((o, a) => (o[a] = n[a], o), {}) : n);
}
function Ue$1(t) {
  let e;
  return t != null && typeof t == "object" && (!(e = Object.getPrototypeOf(t)) || e === Object.prototype);
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a2, _b$1;
function kr(e, t) {
  const r = (e || "").split(";").filter((c) => typeof c == "string" && !!c.trim()), n = r.shift() || "", s = _r(n), i = s.name;
  let o = s.value;
  try {
    o = (t == null ? void 0 : t.decode) === false ? o : ((t == null ? void 0 : t.decode) || decodeURIComponent)(o);
  } catch {
  }
  const u = { name: i, value: o };
  for (const c of r) {
    const l = c.split("="), p = (l.shift() || "").trimStart().toLowerCase(), d = l.join("=");
    switch (p) {
      case "expires": {
        u.expires = new Date(d);
        break;
      }
      case "max-age": {
        u.maxAge = Number.parseInt(d, 10);
        break;
      }
      case "secure": {
        u.secure = true;
        break;
      }
      case "httponly": {
        u.httpOnly = true;
        break;
      }
      case "samesite": {
        u.sameSite = d;
        break;
      }
      default:
        u[p] = d;
    }
  }
  return u;
}
function _r(e) {
  let t = "", r = "";
  const n = e.split("=");
  return n.length > 1 ? (t = n.shift(), r = n.join("=")) : r = e, { name: t, value: r };
}
const ce = "Invariant Violation", { setPrototypeOf: Rr = function(e, t) {
  return e.__proto__ = t, e;
} } = Object;
let ve$2 = class ve extends Error {
  constructor(t = ce) {
    super(typeof t == "number" ? `${ce}: ${t} (see https://github.com/apollographql/invariant-packages)` : t);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", ce);
    Rr(this, ve.prototype);
  }
};
function Ar(e, t) {
  if (!e) throw new ve$2(t);
}
const M$2 = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function xr(e = {}) {
  const t = { options: e, rootNode: ut$1(), staticRoutesMap: {} }, r = (n) => e.strictTrailingSlash ? n : n.replace(/\/$/, "") || "/";
  if (e.routes) for (const n in e.routes) Fe$2(t, r(n), e.routes[n]);
  return { ctx: t, lookup: (n) => $r(t, r(n)), insert: (n, s) => Fe$2(t, r(n), s), remove: (n) => zr(t, r(n)) };
}
function $r(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const n = t.split("/"), s = {};
  let i = false, o = null, u = e.rootNode, c = null;
  for (let l = 0; l < n.length; l++) {
    const p = n[l];
    u.wildcardChildNode !== null && (o = u.wildcardChildNode, c = n.slice(l).join("/"));
    const d = u.children.get(p);
    if (d === void 0) {
      if (u && u.placeholderChildren.length > 1) {
        const w = n.length - l;
        u = u.placeholderChildren.find((f) => f.maxDepth === w) || null;
      } else u = u.placeholderChildren[0] || null;
      if (!u) break;
      u.paramName && (s[u.paramName] = p), i = true;
    } else u = d;
  }
  return (u === null || u.data === null) && o !== null && (u = o, s[u.paramName || "_"] = c, i = true), u ? i ? { ...u.data, params: i ? s : void 0 } : u.data : null;
}
function Fe$2(e, t, r) {
  let n = true;
  const s = t.split("/");
  let i = e.rootNode, o = 0;
  const u = [i];
  for (const c of s) {
    let l;
    if (l = i.children.get(c)) i = l;
    else {
      const p = Pr(c);
      l = ut$1({ type: p, parent: i }), i.children.set(c, l), p === M$2.PLACEHOLDER ? (l.paramName = c === "*" ? `_${o++}` : c.slice(1), i.placeholderChildren.push(l), n = false) : p === M$2.WILDCARD && (i.wildcardChildNode = l, l.paramName = c.slice(3) || "_", n = false), u.push(l), i = l;
    }
  }
  for (const [c, l] of u.entries()) l.maxDepth = Math.max(u.length - c, l.maxDepth || 0);
  return i.data = r, n === true && (e.staticRoutesMap[t] = i), i;
}
function zr(e, t) {
  let r = false;
  const n = t.split("/");
  let s = e.rootNode;
  for (const i of n) if (s = s.children.get(i), !s) return r;
  if (s.data) {
    const i = n.at(-1) || "";
    s.data = null, Object.keys(s.children).length === 0 && s.parent && (s.parent.children.delete(i), s.parent.wildcardChildNode = null, s.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function ut$1(e = {}) {
  return { type: e.type || M$2.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function Pr(e) {
  return e.startsWith("**") ? M$2.WILDCARD : e[0] === ":" || e === "*" ? M$2.PLACEHOLDER : M$2.NORMAL;
}
const Ir = {}, Or = (_a2 = Ir.VITE_API_URL) != null ? _a2 : "http://localhost:3000", Nr = Qe$3(async () => {
  try {
    const e = await fetch(`${Or}/products`);
    return e.ok ? (await e.json()).data : [];
  } catch {
    return [];
  }
}, "src_routes_index_tsx--getProducts_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx?pick=route&tsr-directive-use-server="), Cr = Ve$2(Nr, "products"), Lr = { preload: () => Cr() }, Ur = {}, Fr = (_b$1 = Ur.VITE_API_URL) != null ? _b$1 : "http://localhost:3000", Tr = Qe$3(async (e) => {
  try {
    const t = await fetch(`${Fr}/products/${e}`);
    return t.ok ? (await t.json()).data : null;
  } catch {
    return null;
  }
}, "src_routes_products_id_tsx--getProduct_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx?pick=route&tsr-directive-use-server="), jr = Ve$2(Tr, "product"), Dr = { preload: ({ params: e }) => jr(e.id) }, ct$1 = [{ page: true, $component: { src: "src/routes/cart.tsx?pick=default&pick=$css", build: () => import('../build/cart.mjs'), import: () => import('../build/cart.mjs') }, path: "/cart", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/cart.tsx" }, { page: true, $component: { src: "src/routes/filter.tsx?pick=default&pick=$css", build: () => import('../build/filter.mjs'), import: () => import('../build/filter.mjs') }, path: "/filter", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/filter.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index.mjs'), import: () => import('../build/index.mjs') }, $$route: { require: () => ({ route: Lr }), src: "src/routes/index.tsx?pick=route" }, path: "/", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/products/[id].tsx?pick=default&pick=$css", build: () => import('../build/_id_.mjs'), import: () => import('../build/_id_.mjs') }, $$route: { require: () => ({ route: Dr }), src: "src/routes/products/[id].tsx?pick=route" }, path: "/products/:id", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx" }], Mr = qr(ct$1.filter((e) => e.page));
function qr(e) {
  function t(r, n, s, i) {
    const o = Object.values(r).find((u) => s.startsWith(u.id + "/"));
    return o ? (t(o.children || (o.children = []), n, s.slice(o.id.length)), r) : (r.push({ ...n, id: s, path: s.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, n) => r.path.length - n.path.length).reduce((r, n) => t(r, n, n.path, n.path), []);
}
function Br(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
xr({ routes: ct$1.reduce((e, t) => {
  if (!Br(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (n, s) => `**:${s}`).split("/").map((n) => n.startsWith(":") || n.startsWith("*") ? n : encodeURIComponent(n)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) });
var Hr = " ";
const Wr = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Hr), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function Xr(e, t) {
  let { tag: r, attrs: { key: n, ...s } = { key: void 0 }, children: i } = e;
  return Wr[r]({ attrs: { ...s, nonce: t }, key: n, children: i });
}
function Jr(e, t, r, n = "default") {
  return lazy(async () => {
    var _a3;
    {
      const i = (await e.import())[n], u = (await ((_a3 = t.inputs) == null ? void 0 : _a3[e.src].assets())).filter((l) => l.tag === "style" || l.attrs.rel === "stylesheet");
      return { default: (l) => [...u.map((p) => Xr(p)), createComponent(i, l)] };
    }
  });
}
function lt$1() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && Jr(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return Mr.map(e);
}
let Te$2;
const So = isServer ? () => getRequestEvent().routes : () => Te$2 || (Te$2 = lt$1());
function Gr(e) {
  const t = Be$3(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const n = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], s = r.error ? new Error(r.result) : r.result;
    return { input: n, url: r.url, pending: false, result: r.thrown ? void 0 : s, error: r.thrown ? s : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    Ge$3(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Yr(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: Gr(e) }, routes: lt$1(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Kr = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function Qr(e) {
  return e.status && Kr.has(e.status) ? e.status : 302;
}
const Zr = { "src_routes_index_tsx--getProducts_cache": { functionName: "getProducts_cache", importer: () => import('../build/index-CRHalhgM.mjs') }, "src_routes_products_id_tsx--getProduct_cache": { functionName: "getProduct_cache", importer: () => import('../build/_id_-BWWFWm8a.mjs') } };
var ft$1 = ((e) => (e[e.AggregateError = 1] = "AggregateError", e[e.ArrowFunction = 2] = "ArrowFunction", e[e.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", e[e.ObjectAssign = 8] = "ObjectAssign", e[e.BigIntTypedArray = 16] = "BigIntTypedArray", e[e.RegExp = 32] = "RegExp", e))(ft$1 || {}), R$1 = Symbol.asyncIterator, pt$1 = Symbol.hasInstance, q$2 = Symbol.isConcatSpreadable, A = Symbol.iterator, dt$1 = Symbol.match, ht$1 = Symbol.matchAll, gt$1 = Symbol.replace, mt = Symbol.search, bt$1 = Symbol.species, yt$1 = Symbol.split, wt$1 = Symbol.toPrimitive, B$1 = Symbol.toStringTag, vt$1 = Symbol.unscopables, en = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, Et$1 = { [R$1]: 0, [pt$1]: 1, [q$2]: 2, [A]: 3, [dt$1]: 4, [ht$1]: 5, [gt$1]: 6, [mt]: 7, [bt$1]: 8, [yt$1]: 9, [wt$1]: 10, [B$1]: 11, [vt$1]: 12 }, tn = { 0: R$1, 1: pt$1, 2: q$2, 3: A, 4: dt$1, 5: ht$1, 6: gt$1, 7: mt, 8: bt$1, 9: yt$1, 10: wt$1, 11: B$1, 12: vt$1 }, rn = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, a = void 0, nn = { 2: true, 3: false, 1: a, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN }, St$1 = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, an = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function g(e, t, r, n, s, i, o, u, c, l, p, d) {
  return { t: e, i: t, s: r, c: n, m: s, p: i, e: o, a: u, f: c, b: l, o: p, l: d };
}
function P$2(e) {
  return g(2, a, e, a, a, a, a, a, a, a, a, a);
}
var kt$1 = P$2(2), _t$1 = P$2(3), sn = P$2(1), on = P$2(0), un = P$2(4), cn = P$2(5), ln = P$2(6), fn = P$2(7);
function pn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return a;
  }
}
function k$1(e) {
  let t = "", r = 0, n;
  for (let s = 0, i = e.length; s < i; s++) n = pn(e[s]), n && (t += e.slice(r, s) + n, r = s + 1);
  return r === 0 ? t = e : t += e.slice(r), t;
}
function dn(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function C$2(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, dn);
}
var X$1 = "__SEROVAL_REFS__", ne$1 = "$R", re = `self.${ne$1}`;
function hn(e) {
  return e == null ? `${re}=${re}||[]` : `(${re}=${re}||{})["${k$1(e)}"]=[]`;
}
var Rt$1 = /* @__PURE__ */ new Map(), D$1 = /* @__PURE__ */ new Map();
function At$1(e) {
  return Rt$1.has(e);
}
function gn(e) {
  return D$1.has(e);
}
function mn(e) {
  if (At$1(e)) return Rt$1.get(e);
  throw new Hn(e);
}
function bn(e) {
  if (gn(e)) return D$1.get(e);
  throw new Wn(e);
}
typeof globalThis < "u" ? Object.defineProperty(globalThis, X$1, { value: D$1, configurable: true, writable: false, enumerable: false }) : typeof self < "u" ? Object.defineProperty(self, X$1, { value: D$1, configurable: true, writable: false, enumerable: false }) : typeof global < "u" && Object.defineProperty(global, X$1, { value: D$1, configurable: true, writable: false, enumerable: false });
function Ee$2(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function yn(e) {
  let t = St$1[Ee$2(e)];
  return e.name !== t ? { name: e.name } : e.constructor.name !== t ? { name: e.constructor.name } : {};
}
function xt$1(e, t) {
  let r = yn(e), n = Object.getOwnPropertyNames(e);
  for (let s = 0, i = n.length, o; s < i; s++) o = n[s], o !== "name" && o !== "message" && (o === "stack" ? t & 4 && (r = r || {}, r[o] = e[o]) : (r = r || {}, r[o] = e[o]));
  return r;
}
function $t$1(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function wn(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return cn;
    case Number.NEGATIVE_INFINITY:
      return ln;
  }
  return e !== e ? fn : Object.is(e, -0) ? un : g(0, a, e, a, a, a, a, a, a, a, a, a);
}
function zt$1(e) {
  return g(1, a, k$1(e), a, a, a, a, a, a, a, a, a);
}
function vn(e) {
  return g(3, a, "" + e, a, a, a, a, a, a, a, a, a);
}
function En(e) {
  return g(4, e, a, a, a, a, a, a, a, a, a, a);
}
function Sn(e, t) {
  let r = t.valueOf();
  return g(5, e, r !== r ? "" : t.toISOString(), a, a, a, a, a, a, a, a, a);
}
function kn(e, t) {
  return g(6, e, a, k$1(t.source), t.flags, a, a, a, a, a, a, a);
}
function _n(e, t) {
  return g(17, e, Et$1[t], a, a, a, a, a, a, a, a, a);
}
function Rn(e, t) {
  return g(18, e, k$1(mn(t)), a, a, a, a, a, a, a, a, a);
}
function Pt$1(e, t, r) {
  return g(25, e, r, k$1(t), a, a, a, a, a, a, a, a);
}
function An(e, t, r) {
  return g(9, e, a, a, a, a, a, r, a, a, $t$1(t), a);
}
function xn(e, t) {
  return g(21, e, a, a, a, a, a, a, t, a, a, a);
}
function $n(e, t, r) {
  return g(15, e, a, t.constructor.name, a, a, a, a, r, t.byteOffset, a, t.length);
}
function zn(e, t, r) {
  return g(16, e, a, t.constructor.name, a, a, a, a, r, t.byteOffset, a, t.byteLength);
}
function Pn(e, t, r) {
  return g(20, e, a, a, a, a, a, a, r, t.byteOffset, a, t.byteLength);
}
function In(e, t, r) {
  return g(13, e, Ee$2(t), a, k$1(t.message), r, a, a, a, a, a, a);
}
function On(e, t, r) {
  return g(14, e, Ee$2(t), a, k$1(t.message), r, a, a, a, a, a, a);
}
function Nn(e, t) {
  return g(7, e, a, a, a, a, a, t, a, a, a, a);
}
function Cn(e, t) {
  return g(28, a, a, a, a, a, a, [e, t], a, a, a, a);
}
function Ln(e, t) {
  return g(30, a, a, a, a, a, a, [e, t], a, a, a, a);
}
function Un(e, t, r) {
  return g(31, e, a, a, a, a, a, r, t, a, a, a);
}
function Fn(e, t) {
  return g(32, e, a, a, a, a, a, a, t, a, a, a);
}
function Tn(e, t) {
  return g(33, e, a, a, a, a, a, a, t, a, a, a);
}
function jn(e, t) {
  return g(34, e, a, a, a, a, a, a, t, a, a, a);
}
function Dn(e, t, r, n) {
  return g(35, e, r, a, a, a, a, t, a, a, a, n);
}
var Mn = { parsing: 1, serialization: 2, deserialization: 3 };
function qn(e) {
  return `Seroval Error (step: ${Mn[e]})`;
}
var Bn = (e, t) => qn(e), It$1 = class It extends Error {
  constructor(e, t) {
    super(Bn(e)), this.cause = t;
  }
}, je$2 = class je extends It$1 {
  constructor(e) {
    super("parsing", e);
  }
}, Vn = class extends It$1 {
  constructor(e) {
    super("deserialization", e);
  }
};
function x$1(e) {
  return `Seroval Error (specific: ${e})`;
}
var ae = class extends Error {
  constructor(t) {
    super(x$1(1)), this.value = t;
  }
}, L$2 = class L extends Error {
  constructor(t) {
    super(x$1(2));
  }
}, Ot$1 = class Ot extends Error {
  constructor(e) {
    super(x$1(3));
  }
}, Q$1 = class Q extends Error {
  constructor(t) {
    super(x$1(4));
  }
}, Hn = class extends Error {
  constructor(e) {
    super(x$1(5)), this.value = e;
  }
}, Wn = class extends Error {
  constructor(e) {
    super(x$1(6));
  }
}, Xn = class extends Error {
  constructor(e) {
    super(x$1(7));
  }
}, I$1 = class I extends Error {
  constructor(t) {
    super(x$1(8));
  }
}, Nt$1 = class Nt extends Error {
  constructor(t) {
    super(x$1(9));
  }
}, Jn = class {
  constructor(t, r) {
    this.value = t, this.replacement = r;
  }
}, se = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((t, r) => {
    e.s = t, e.f = r;
  }), e;
}, Gn = (e, t) => {
  e.s(t), e.p.s = 1, e.p.v = t;
}, Yn = (e, t) => {
  e.f(t), e.p.s = 2, e.p.v = t;
}, Kn = se.toString(), Qn = Gn.toString(), Zn = Yn.toString(), Ct$1 = () => {
  let e = [], t = [], r = true, n = false, s = 0, i = (c, l, p) => {
    for (p = 0; p < s; p++) t[p] && t[p][l](c);
  }, o = (c, l, p, d) => {
    for (l = 0, p = e.length; l < p; l++) d = e[l], !r && l === p - 1 ? c[n ? "return" : "throw"](d) : c.next(d);
  }, u = (c, l) => (r && (l = s++, t[l] = c), o(c), () => {
    r && (t[l] = t[s], t[s--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (c) => u(c), next: (c) => {
    r && (e.push(c), i(c, "next"));
  }, throw: (c) => {
    r && (e.push(c), i(c, "throw"), r = false, n = false, t.length = 0);
  }, return: (c) => {
    r && (e.push(c), i(c, "return"), r = false, n = true, t.length = 0);
  } };
}, ea = Ct$1.toString(), Lt$1 = (e) => (t) => () => {
  let r = 0, n = { [e]: () => n, next: () => {
    if (r > t.d) return { done: true, value: void 0 };
    let s = r++, i = t.v[s];
    if (s === t.t) throw i;
    return { done: s === t.d, value: i };
  } };
  return n;
}, ta = Lt$1.toString(), Ut$1 = (e, t) => (r) => () => {
  let n = 0, s = -1, i = false, o = [], u = [], c = (p = 0, d = u.length) => {
    for (; p < d; p++) u[p].s({ done: true, value: void 0 });
  };
  r.on({ next: (p) => {
    let d = u.shift();
    d && d.s({ done: false, value: p }), o.push(p);
  }, throw: (p) => {
    let d = u.shift();
    d && d.f(p), c(), s = o.length, i = true, o.push(p);
  }, return: (p) => {
    let d = u.shift();
    d && d.s({ done: true, value: p }), c(), s = o.length, o.push(p);
  } });
  let l = { [e]: () => l, next: () => {
    if (s === -1) {
      let w = n++;
      if (w >= o.length) {
        let f = t();
        return u.push(f), f.p;
      }
      return { done: false, value: o[w] };
    }
    if (n > s) return { done: true, value: void 0 };
    let p = n++, d = o[p];
    if (p !== s) return { done: false, value: d };
    if (i) throw d;
    return { done: true, value: d };
  } };
  return l;
}, ra = Ut$1.toString(), Ft = (e) => {
  let t = atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++) n[s] = t.charCodeAt(s);
  return n.buffer;
}, na = Ft.toString();
function aa(e) {
  return "__SEROVAL_SEQUENCE__" in e;
}
function Tt$1(e, t, r) {
  return { __SEROVAL_SEQUENCE__: true, v: e, t, d: r };
}
function sa(e) {
  let t = [], r = -1, n = -1, s = e[A]();
  for (; ; ) try {
    let i = s.next();
    if (t.push(i.value), i.done) {
      n = t.length - 1;
      break;
    }
  } catch (i) {
    r = t.length, t.push(i);
  }
  return Tt$1(t, r, n);
}
var ia = Lt$1(A);
function oa(e) {
  return ia(e);
}
var ua = {}, ca = {}, la = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, fa = { 0: "[]", 1: Kn, 2: Qn, 3: Zn, 4: ea, 5: na };
function ie(e) {
  return "__SEROVAL_STREAM__" in e;
}
function Z$2() {
  return Ct$1();
}
function pa(e) {
  let t = Z$2(), r = e[R$1]();
  async function n() {
    try {
      let s = await r.next();
      s.done ? t.return(s.value) : (t.next(s.value), await n());
    } catch (s) {
      t.throw(s);
    }
  }
  return n().catch(() => {
  }), t;
}
var da = Ut$1(R$1, se);
function ha(e) {
  return da(e);
}
function ga(e, t) {
  return { plugins: t.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (t.disabledFeatures || 0), refs: t.refs || /* @__PURE__ */ new Map(), depthLimit: t.depthLimit || 1e3 };
}
function ma(e, t) {
  e.marked.add(t);
}
function jt(e, t) {
  let r = e.refs.size;
  return e.refs.set(t, r), r;
}
function oe(e, t) {
  let r = e.refs.get(t);
  return r != null ? (ma(e, r), { type: 1, value: En(r) }) : { type: 0, value: jt(e, t) };
}
function Se$2(e, t) {
  let r = oe(e, t);
  return r.type === 1 ? r : At$1(t) ? { type: 2, value: Rn(r.value, t) } : r;
}
function O(e, t) {
  let r = Se$2(e, t);
  if (r.type !== 0) return r.value;
  if (t in Et$1) return _n(r.value, t);
  throw new ae(t);
}
function U$1(e, t) {
  let r = oe(e, la[t]);
  return r.type === 1 ? r.value : g(26, r.value, t, a, a, a, a, a, a, a, a, a);
}
function ba(e) {
  let t = oe(e, ua);
  return t.type === 1 ? t.value : g(27, t.value, a, a, a, a, a, a, O(e, A), a, a, a);
}
function ya(e) {
  let t = oe(e, ca);
  return t.type === 1 ? t.value : g(29, t.value, a, a, a, a, a, [U$1(e, 1), O(e, R$1)], a, a, a, a);
}
function wa(e, t, r, n) {
  return g(r ? 11 : 10, e, a, a, a, n, a, a, a, a, $t$1(t), a);
}
function va(e, t, r, n) {
  return g(8, t, a, a, a, a, { k: r, v: n }, a, U$1(e, 0), a, a, a);
}
function Ea(e, t, r) {
  return g(22, t, r, a, a, a, a, a, U$1(e, 1), a, a, a);
}
function Sa(e, t, r) {
  let n = new Uint8Array(r), s = "";
  for (let i = 0, o = n.length; i < o; i++) s += String.fromCharCode(n[i]);
  return g(19, t, k$1(btoa(s)), a, a, a, a, a, U$1(e, 5), a, a, a);
}
var ka = ((e) => (e[e.Vanilla = 1] = "Vanilla", e[e.Cross = 2] = "Cross", e))(ka || {});
function Dt$1(e, t) {
  for (let r = 0, n = t.length; r < n; r++) {
    let s = t[r];
    e.has(s) || (e.add(s), s.extends && Dt$1(e, s.extends));
  }
}
function ke$1(e) {
  if (e) {
    let t = /* @__PURE__ */ new Set();
    return Dt$1(t, e), [...t];
  }
}
function _a$1(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Xn(e);
  }
}
var Ra = 1e6, Aa = 1e4, xa = 2e4;
function Mt(e, t) {
  switch (t) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var $a = 1e3;
function za(e, t) {
  var r;
  return { mode: e, plugins: t.plugins, refs: t.refs || /* @__PURE__ */ new Map(), features: (r = t.features) != null ? r : 63 ^ (t.disabledFeatures || 0), depthLimit: t.depthLimit || $a };
}
function Pa(e) {
  return { mode: 1, base: za(1, e), child: a, state: { marked: new Set(e.markedRefs) } };
}
var Ia = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  deserialize(e) {
    return b(this._p, this.depth, e);
  }
};
function qt(e, t) {
  if (t < 0 || !Number.isFinite(t) || !Number.isInteger(t)) throw new I$1({ t: 4, i: t });
  if (e.refs.has(t)) throw new Error("Conflicted ref id: " + t);
}
function Oa(e, t, r) {
  return qt(e.base, t), e.state.marked.has(t) && e.base.refs.set(t, r), r;
}
function Na(e, t, r) {
  return qt(e.base, t), e.base.refs.set(t, r), r;
}
function y(e, t, r) {
  return e.mode === 1 ? Oa(e, t, r) : Na(e, t, r);
}
function me$1(e, t, r) {
  if (Object.hasOwn(t, r)) return t[r];
  throw new I$1(e);
}
function Ca(e, t) {
  return y(e, t.i, bn(C$2(t.s)));
}
function La(e, t, r) {
  let n = r.a, s = n.length, i = y(e, r.i, new Array(s));
  for (let o = 0, u; o < s; o++) u = n[o], u && (i[o] = b(e, t, u));
  return Mt(i, r.o), i;
}
function Ua(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Fa(e) {
  switch (e) {
    case R$1:
    case q$2:
    case B$1:
    case A:
      return true;
    default:
      return false;
  }
}
function De$1(e, t, r) {
  Ua(t) ? e[t] = r : Object.defineProperty(e, t, { value: r, configurable: true, enumerable: true, writable: true });
}
function Ta(e, t, r, n, s) {
  if (typeof n == "string") De$1(r, n, b(e, t, s));
  else {
    let i = b(e, t, n);
    switch (typeof i) {
      case "string":
        De$1(r, i, b(e, t, s));
        break;
      case "symbol":
        Fa(i) && (r[i] = b(e, t, s));
        break;
      default:
        throw new I$1(n);
    }
  }
}
function Bt(e, t, r, n) {
  let s = r.k;
  if (s.length > 0) for (let i = 0, o = r.v, u = s.length; i < u; i++) Ta(e, t, n, s[i], o[i]);
  return n;
}
function ja(e, t, r) {
  let n = y(e, r.i, r.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return Bt(e, t, r.p, n), Mt(n, r.o), n;
}
function Da(e, t) {
  return y(e, t.i, new Date(t.s));
}
function Ma(e, t) {
  if (e.base.features & 32) {
    let r = C$2(t.c);
    if (r.length > xa) throw new I$1(t);
    return y(e, t.i, new RegExp(r, t.m));
  }
  throw new L$2(t);
}
function qa(e, t, r) {
  let n = y(e, r.i, /* @__PURE__ */ new Set());
  for (let s = 0, i = r.a, o = i.length; s < o; s++) n.add(b(e, t, i[s]));
  return n;
}
function Ba(e, t, r) {
  let n = y(e, r.i, /* @__PURE__ */ new Map());
  for (let s = 0, i = r.e.k, o = r.e.v, u = i.length; s < u; s++) n.set(b(e, t, i[s]), b(e, t, o[s]));
  return n;
}
function Va(e, t) {
  if (t.s.length > Ra) throw new I$1(t);
  return y(e, t.i, Ft(C$2(t.s)));
}
function Ha(e, t, r) {
  var n;
  let s = _a$1(r.c), i = b(e, t, r.f), o = (n = r.b) != null ? n : 0;
  if (o < 0 || o > i.byteLength) throw new I$1(r);
  return y(e, r.i, new s(i, o, r.l));
}
function Wa(e, t, r) {
  var n;
  let s = b(e, t, r.f), i = (n = r.b) != null ? n : 0;
  if (i < 0 || i > s.byteLength) throw new I$1(r);
  return y(e, r.i, new DataView(s, i, r.l));
}
function Vt(e, t, r, n) {
  if (r.p) {
    let s = Bt(e, t, r.p, {});
    Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
  }
  return n;
}
function Xa(e, t, r) {
  let n = y(e, r.i, new AggregateError([], C$2(r.m)));
  return Vt(e, t, r, n);
}
function Ja(e, t, r) {
  let n = me$1(r, an, r.s), s = y(e, r.i, new n(C$2(r.m)));
  return Vt(e, t, r, s);
}
function Ga(e, t, r) {
  let n = se(), s = y(e, r.i, n.p), i = b(e, t, r.f);
  return r.s ? n.s(i) : n.f(i), s;
}
function Ya(e, t, r) {
  return y(e, r.i, Object(b(e, t, r.f)));
}
function Ka(e, t, r) {
  let n = e.base.plugins;
  if (n) {
    let s = C$2(r.c);
    for (let i = 0, o = n.length; i < o; i++) {
      let u = n[i];
      if (u.tag === s) return y(e, r.i, u.deserialize(r.s, new Ia(e, t), { id: r.i }));
    }
  }
  throw new Ot$1(r.c);
}
function Qa(e, t) {
  return y(e, t.i, y(e, t.s, se()).p);
}
function Za(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return n.s(b(e, t, r.a[1])), a;
  throw new Q$1("Promise");
}
function es(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return n.f(b(e, t, r.a[1])), a;
  throw new Q$1("Promise");
}
function ts(e, t, r) {
  b(e, t, r.a[0]);
  let n = b(e, t, r.a[1]);
  return oa(n);
}
function rs(e, t, r) {
  b(e, t, r.a[0]);
  let n = b(e, t, r.a[1]);
  return ha(n);
}
function ns(e, t, r) {
  let n = y(e, r.i, Z$2()), s = r.a, i = s.length;
  if (i) for (let o = 0; o < i; o++) b(e, t, s[o]);
  return n;
}
function as(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && ie(n)) return n.next(b(e, t, r.f)), a;
  throw new Q$1("Stream");
}
function ss(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && ie(n)) return n.throw(b(e, t, r.f)), a;
  throw new Q$1("Stream");
}
function is(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && ie(n)) return n.return(b(e, t, r.f)), a;
  throw new Q$1("Stream");
}
function os(e, t, r) {
  return b(e, t, r.f), a;
}
function us(e, t, r) {
  return b(e, t, r.a[1]), a;
}
function cs(e, t, r) {
  let n = y(e, r.i, Tt$1([], r.s, r.l));
  for (let s = 0, i = r.a.length; s < i; s++) n.v[s] = b(e, t, r.a[s]);
  return n;
}
function b(e, t, r) {
  if (t > e.base.depthLimit) throw new Nt$1(e.base.depthLimit);
  switch (t += 1, r.t) {
    case 2:
      return me$1(r, nn, r.s);
    case 0:
      return Number(r.s);
    case 1:
      return C$2(String(r.s));
    case 3:
      if (String(r.s).length > Aa) throw new I$1(r);
      return BigInt(r.s);
    case 4:
      return e.base.refs.get(r.i);
    case 18:
      return Ca(e, r);
    case 9:
      return La(e, t, r);
    case 10:
    case 11:
      return ja(e, t, r);
    case 5:
      return Da(e, r);
    case 6:
      return Ma(e, r);
    case 7:
      return qa(e, t, r);
    case 8:
      return Ba(e, t, r);
    case 19:
      return Va(e, r);
    case 16:
    case 15:
      return Ha(e, t, r);
    case 20:
      return Wa(e, t, r);
    case 14:
      return Xa(e, t, r);
    case 13:
      return Ja(e, t, r);
    case 12:
      return Ga(e, t, r);
    case 17:
      return me$1(r, tn, r.s);
    case 21:
      return Ya(e, t, r);
    case 25:
      return Ka(e, t, r);
    case 22:
      return Qa(e, r);
    case 23:
      return Za(e, t, r);
    case 24:
      return es(e, t, r);
    case 28:
      return ts(e, t, r);
    case 30:
      return rs(e, t, r);
    case 31:
      return ns(e, t, r);
    case 32:
      return as(e, t, r);
    case 33:
      return ss(e, t, r);
    case 34:
      return is(e, t, r);
    case 27:
      return os(e, t, r);
    case 29:
      return us(e, t, r);
    case 35:
      return cs(e, t, r);
    default:
      throw new L$2(r);
  }
}
function ls(e, t) {
  try {
    return b(e, 0, t);
  } catch (r) {
    throw new Vn(r);
  }
}
var fs = () => T, ps = fs.toString(), Ht = /=>/.test(ps);
function Wt(e, t) {
  return Ht ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (t.startsWith("{") ? "(" + t + ")" : t) : "function(" + e.join(",") + "){return " + t + "}";
}
function ds(e, t) {
  return Ht ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + t + "}" : "function(" + e.join(",") + "){" + t + "}";
}
var Xt = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", Me$2 = Xt.length, Jt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", qe$3 = Jt.length;
function hs(e) {
  let t = e % Me$2, r = Xt[t];
  for (e = (e - t) / Me$2; e > 0; ) t = e % qe$3, r += Jt[t], e = (e - t) / qe$3;
  return r;
}
var gs = /^[$A-Z_][0-9A-Z_$]*$/i;
function Gt(e) {
  let t = e[0];
  return (t === "$" || t === "_" || t >= "A" && t <= "Z" || t >= "a" && t <= "z") && gs.test(e);
}
function J(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function ms(e) {
  let t = [], r = e[0];
  for (let n = 1, s = e.length, i, o = r; n < s; n++) i = e[n], i.t === 0 && i.v === o.v ? r = { t: 0, s: i.s, k: a, v: J(r) } : i.t === 2 && i.s === o.s ? r = { t: 2, s: J(r), k: i.k, v: i.v } : i.t === 1 && i.s === o.s ? r = { t: 1, s: J(r), k: a, v: i.v } : i.t === 3 && i.s === o.s ? r = { t: 3, s: J(r), k: i.k, v: a } : (t.push(r), r = i), o = i;
  return t.push(r), t;
}
function Yt(e) {
  if (e.length) {
    let t = "", r = ms(e);
    for (let n = 0, s = r.length; n < s; n++) t += J(r[n]) + ",";
    return t;
  }
  return a;
}
var bs = "Object.create(null)", ys = "new Set", ws = "new Map", vs = "Promise.resolve", Es = "Promise.reject", Ss = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: a };
function ks(e, t) {
  return { mode: e, plugins: t.plugins, features: t.features, marked: new Set(t.markedRefs), stack: [], flags: [], assignments: [] };
}
function _s(e) {
  return { mode: 2, base: ks(2, e), state: e, child: a };
}
var Rs = class {
  constructor(e) {
    this._p = e;
  }
  serialize(e) {
    return h(this._p, e);
  }
};
function As(e, t) {
  let r = e.valid.get(t);
  r == null && (r = e.valid.size, e.valid.set(t, r));
  let n = e.vars[r];
  return n == null && (n = hs(r), e.vars[r] = n), n;
}
function xs(e) {
  return ne$1 + "[" + e + "]";
}
function m(e, t) {
  return e.mode === 1 ? As(e.state, t) : xs(t);
}
function E$1(e, t) {
  e.marked.add(t);
}
function be$2(e, t) {
  return e.marked.has(t);
}
function _e$2(e, t, r) {
  t !== 0 && (E$1(e.base, r), e.base.flags.push({ type: t, value: m(e, r) }));
}
function $s(e) {
  let t = "";
  for (let r = 0, n = e.flags, s = n.length; r < s; r++) {
    let i = n[r];
    t += Ss[i.type] + "(" + i.value + "),";
  }
  return t;
}
function zs(e) {
  let t = Yt(e.assignments), r = $s(e);
  return t ? r ? t + r : t : r;
}
function Re$2(e, t, r) {
  e.assignments.push({ t: 0, s: t, k: a, v: r });
}
function Ps(e, t, r) {
  e.base.assignments.push({ t: 1, s: m(e, t), k: a, v: r });
}
function W$2(e, t, r, n) {
  e.base.assignments.push({ t: 2, s: m(e, t), k: r, v: n });
}
function Be$2(e, t, r) {
  e.base.assignments.push({ t: 3, s: m(e, t), k: r, v: a });
}
function Y$2(e, t, r, n) {
  Re$2(e.base, m(e, t) + "[" + r + "]", n);
}
function ye$2(e, t, r, n) {
  Re$2(e.base, m(e, t) + "." + r, n);
}
function Is(e, t, r, n) {
  Re$2(e.base, m(e, t) + ".v[" + r + "]", n);
}
function _$2(e, t) {
  return t.t === 4 && e.stack.includes(t.i);
}
function H$1(e, t, r) {
  return e.mode === 1 && !be$2(e.base, t) ? r : m(e, t) + "=" + r;
}
function Os(e) {
  return X$1 + '.get("' + e.s + '")';
}
function Ve$1(e, t, r, n) {
  return r ? _$2(e.base, r) ? (E$1(e.base, t), Y$2(e, t, n, m(e, r.i)), "") : h(e, r) : "";
}
function Ns(e, t) {
  let r = t.i, n = t.a, s = n.length;
  if (s > 0) {
    e.base.stack.push(r);
    let i = Ve$1(e, r, n[0], 0), o = i === "";
    for (let u = 1, c; u < s; u++) c = Ve$1(e, r, n[u], u), i += "," + c, o = c === "";
    return e.base.stack.pop(), _e$2(e, t.o, t.i), "[" + i + (o ? ",]" : "]");
  }
  return "[]";
}
function He$3(e, t, r, n) {
  if (typeof r == "string") {
    let s = Number(r), i = s >= 0 && s.toString() === r || Gt(r);
    if (_$2(e.base, n)) {
      let o = m(e, n.i);
      return E$1(e.base, t.i), i && s !== s ? ye$2(e, t.i, r, o) : Y$2(e, t.i, i ? r : '"' + r + '"', o), "";
    }
    return (i ? r : '"' + r + '"') + ":" + h(e, n);
  }
  return "[" + h(e, r) + "]:" + h(e, n);
}
function Kt(e, t, r) {
  let n = r.k, s = n.length;
  if (s > 0) {
    let i = r.v;
    e.base.stack.push(t.i);
    let o = He$3(e, t, n[0], i[0]);
    for (let u = 1, c = o; u < s; u++) c = He$3(e, t, n[u], i[u]), o += (c && o && ",") + c;
    return e.base.stack.pop(), "{" + o + "}";
  }
  return "{}";
}
function Cs(e, t) {
  return _e$2(e, t.o, t.i), Kt(e, t, t.p);
}
function Ls(e, t, r, n) {
  let s = Kt(e, t, r);
  return s !== "{}" ? "Object.assign(" + n + "," + s + ")" : n;
}
function Us(e, t, r, n, s) {
  let i = e.base, o = h(e, s), u = Number(n), c = u >= 0 && u.toString() === n || Gt(n);
  if (_$2(i, s)) c && u !== u ? ye$2(e, t.i, n, o) : Y$2(e, t.i, c ? n : '"' + n + '"', o);
  else {
    let l = i.assignments;
    i.assignments = r, c && u !== u ? ye$2(e, t.i, n, o) : Y$2(e, t.i, c ? n : '"' + n + '"', o), i.assignments = l;
  }
}
function Fs(e, t, r, n, s) {
  if (typeof n == "string") Us(e, t, r, n, s);
  else {
    let i = e.base, o = i.stack;
    i.stack = [];
    let u = h(e, s);
    i.stack = o;
    let c = i.assignments;
    i.assignments = r, Y$2(e, t.i, h(e, n), u), i.assignments = c;
  }
}
function Ts(e, t, r) {
  let n = r.k, s = n.length;
  if (s > 0) {
    let i = [], o = r.v;
    e.base.stack.push(t.i);
    for (let u = 0; u < s; u++) Fs(e, t, i, n[u], o[u]);
    return e.base.stack.pop(), Yt(i);
  }
  return a;
}
function Ae$2(e, t, r) {
  if (t.p) {
    let n = e.base;
    if (n.features & 8) r = Ls(e, t, t.p, r);
    else {
      E$1(n, t.i);
      let s = Ts(e, t, t.p);
      if (s) return "(" + H$1(e, t.i, r) + "," + s + m(e, t.i) + ")";
    }
  }
  return r;
}
function js(e, t) {
  return _e$2(e, t.o, t.i), Ae$2(e, t, bs);
}
function Ds(e) {
  return 'new Date("' + e.s + '")';
}
function Ms(e, t) {
  if (e.base.features & 32) return "/" + t.c + "/" + t.m;
  throw new L$2(t);
}
function We$2(e, t, r) {
  let n = e.base;
  return _$2(n, r) ? (E$1(n, t), Ps(e, t, m(e, r.i)), "") : h(e, r);
}
function qs(e, t) {
  let r = ys, n = t.a, s = n.length, i = t.i;
  if (s > 0) {
    e.base.stack.push(i);
    let o = We$2(e, i, n[0]);
    for (let u = 1, c = o; u < s; u++) c = We$2(e, i, n[u]), o += (c && o && ",") + c;
    e.base.stack.pop(), o && (r += "([" + o + "])");
  }
  return r;
}
function Xe$1(e, t, r, n, s) {
  let i = e.base;
  if (_$2(i, r)) {
    let o = m(e, r.i);
    if (E$1(i, t), _$2(i, n)) {
      let c = m(e, n.i);
      return W$2(e, t, o, c), "";
    }
    if (n.t !== 4 && n.i != null && be$2(i, n.i)) {
      let c = "(" + h(e, n) + ",[" + s + "," + s + "])";
      return W$2(e, t, o, m(e, n.i)), Be$2(e, t, s), c;
    }
    let u = i.stack;
    return i.stack = [], W$2(e, t, o, h(e, n)), i.stack = u, "";
  }
  if (_$2(i, n)) {
    let o = m(e, n.i);
    if (E$1(i, t), r.t !== 4 && r.i != null && be$2(i, r.i)) {
      let c = "(" + h(e, r) + ",[" + s + "," + s + "])";
      return W$2(e, t, m(e, r.i), o), Be$2(e, t, s), c;
    }
    let u = i.stack;
    return i.stack = [], W$2(e, t, h(e, r), o), i.stack = u, "";
  }
  return "[" + h(e, r) + "," + h(e, n) + "]";
}
function Bs(e, t) {
  let r = ws, n = t.e.k, s = n.length, i = t.i, o = t.f, u = m(e, o.i), c = e.base;
  if (s > 0) {
    let l = t.e.v;
    c.stack.push(i);
    let p = Xe$1(e, i, n[0], l[0], u);
    for (let d = 1, w = p; d < s; d++) w = Xe$1(e, i, n[d], l[d], u), p += (w && p && ",") + w;
    c.stack.pop(), p && (r += "([" + p + "])");
  }
  return o.t === 26 && (E$1(c, o.i), r = "(" + h(e, o) + "," + r + ")"), r;
}
function Vs(e, t) {
  return F$2(e, t.f) + '("' + t.s + '")';
}
function Hs(e, t) {
  return "new " + t.c + "(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Ws(e, t) {
  return "new DataView(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Xs(e, t) {
  let r = t.i;
  e.base.stack.push(r);
  let n = Ae$2(e, t, 'new AggregateError([],"' + t.m + '")');
  return e.base.stack.pop(), n;
}
function Js(e, t) {
  return Ae$2(e, t, "new " + St$1[t.s] + '("' + t.m + '")');
}
function Gs(e, t) {
  let r, n = t.f, s = t.i, i = t.s ? vs : Es, o = e.base;
  if (_$2(o, n)) {
    let u = m(e, n.i);
    r = i + (t.s ? "().then(" + Wt([], u) + ")" : "().catch(" + ds([], "throw " + u) + ")");
  } else {
    o.stack.push(s);
    let u = h(e, n);
    o.stack.pop(), r = i + "(" + u + ")";
  }
  return r;
}
function Ys(e, t) {
  return "Object(" + h(e, t.f) + ")";
}
function F$2(e, t) {
  let r = h(e, t);
  return t.t === 4 ? r : "(" + r + ")";
}
function Ks(e, t) {
  if (e.mode === 1) throw new L$2(t);
  return "(" + H$1(e, t.s, F$2(e, t.f) + "()") + ").p";
}
function Qs(e, t) {
  if (e.mode === 1) throw new L$2(t);
  return F$2(e, t.a[0]) + "(" + m(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function Zs(e, t) {
  if (e.mode === 1) throw new L$2(t);
  return F$2(e, t.a[0]) + "(" + m(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function ei(e, t) {
  let r = e.base.plugins;
  if (r) for (let n = 0, s = r.length; n < s; n++) {
    let i = r[n];
    if (i.tag === t.c) return e.child == null && (e.child = new Rs(e)), i.serialize(t.s, e.child, { id: t.i });
  }
  throw new Ot$1(t.c);
}
function ti(e, t) {
  let r = "", n = false;
  return t.f.t !== 4 && (E$1(e.base, t.f.i), r = "(" + h(e, t.f) + ",", n = true), r += H$1(e, t.i, "(" + ta + ")(" + m(e, t.f.i) + ")"), n && (r += ")"), r;
}
function ri(e, t) {
  return F$2(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function ni(e, t) {
  let r = t.a[0], n = t.a[1], s = e.base, i = "";
  r.t !== 4 && (E$1(s, r.i), i += "(" + h(e, r)), n.t !== 4 && (E$1(s, n.i), i += (i ? "," : "(") + h(e, n)), i && (i += ",");
  let o = H$1(e, t.i, "(" + ra + ")(" + m(e, n.i) + "," + m(e, r.i) + ")");
  return i ? i + o + ")" : o;
}
function ai(e, t) {
  return F$2(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function si(e, t) {
  let r = H$1(e, t.i, F$2(e, t.f) + "()"), n = t.a.length;
  if (n) {
    let s = h(e, t.a[0]);
    for (let i = 1; i < n; i++) s += "," + h(e, t.a[i]);
    return "(" + r + "," + s + "," + m(e, t.i) + ")";
  }
  return r;
}
function ii(e, t) {
  return m(e, t.i) + ".next(" + h(e, t.f) + ")";
}
function oi(e, t) {
  return m(e, t.i) + ".throw(" + h(e, t.f) + ")";
}
function ui(e, t) {
  return m(e, t.i) + ".return(" + h(e, t.f) + ")";
}
function Je$2(e, t, r, n) {
  let s = e.base;
  return _$2(s, n) ? (E$1(s, t), Is(e, t, r, m(e, n.i)), "") : h(e, n);
}
function ci(e, t) {
  let r = t.a, n = r.length, s = t.i;
  if (n > 0) {
    e.base.stack.push(s);
    let i = Je$2(e, s, 0, r[0]);
    for (let o = 1, u = i; o < n; o++) u = Je$2(e, s, o, r[o]), i += (u && i && ",") + u;
    if (e.base.stack.pop(), i) return "{__SEROVAL_SEQUENCE__:!0,v:[" + i + "],t:" + t.s + ",d:" + t.l + "}";
  }
  return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function li(e, t) {
  switch (t.t) {
    case 17:
      return en[t.s];
    case 18:
      return Os(t);
    case 9:
      return Ns(e, t);
    case 10:
      return Cs(e, t);
    case 11:
      return js(e, t);
    case 5:
      return Ds(t);
    case 6:
      return Ms(e, t);
    case 7:
      return qs(e, t);
    case 8:
      return Bs(e, t);
    case 19:
      return Vs(e, t);
    case 16:
    case 15:
      return Hs(e, t);
    case 20:
      return Ws(e, t);
    case 14:
      return Xs(e, t);
    case 13:
      return Js(e, t);
    case 12:
      return Gs(e, t);
    case 21:
      return Ys(e, t);
    case 22:
      return Ks(e, t);
    case 25:
      return ei(e, t);
    case 26:
      return fa[t.s];
    case 35:
      return ci(e, t);
    default:
      throw new L$2(t);
  }
}
function h(e, t) {
  switch (t.t) {
    case 2:
      return rn[t.s];
    case 0:
      return "" + t.s;
    case 1:
      return '"' + t.s + '"';
    case 3:
      return t.s + "n";
    case 4:
      return m(e, t.i);
    case 23:
      return Qs(e, t);
    case 24:
      return Zs(e, t);
    case 27:
      return ti(e, t);
    case 28:
      return ri(e, t);
    case 29:
      return ni(e, t);
    case 30:
      return ai(e, t);
    case 31:
      return si(e, t);
    case 32:
      return ii(e, t);
    case 33:
      return oi(e, t);
    case 34:
      return ui(e, t);
    default:
      return H$1(e, t.i, li(e, t));
  }
}
function fi(e, t) {
  let r = h(e, t), n = t.i;
  if (n == null) return r;
  let s = zs(e.base), i = m(e, n), o = e.state.scopeId, u = o == null ? "" : ne$1, c = s ? "(" + r + "," + s + i + ")" : r;
  if (u === "") return t.t === 10 && !s ? "(" + c + ")" : c;
  let l = o == null ? "()" : "(" + ne$1 + '["' + k$1(o) + '"])';
  return "(" + Wt([u], c) + ")" + l;
}
var pi = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return v(this._p, this.depth, e);
  }
}, di = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return v(this._p, this.depth, e);
  }
  parseWithError(e) {
    return N$1(this._p, this.depth, e);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    Pe$2(this._p);
  }
  popPendingState() {
    K(this._p);
  }
  onParse(e) {
    V$1(this._p, e);
  }
  onError(e) {
    $e$2(this._p, e);
  }
};
function hi(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone };
}
function Qt(e) {
  return { type: 2, base: ga(2, e), state: hi(e) };
}
function gi(e, t, r) {
  let n = [];
  for (let s = 0, i = r.length; s < i; s++) s in r ? n[s] = v(e, t, r[s]) : n[s] = 0;
  return n;
}
function mi(e, t, r, n) {
  return An(r, n, gi(e, t, n));
}
function xe$2(e, t, r) {
  let n = Object.entries(r), s = [], i = [];
  for (let o = 0, u = n.length; o < u; o++) s.push(k$1(n[o][0])), i.push(v(e, t, n[o][1]));
  return A in r && (s.push(O(e.base, A)), i.push(Cn(ba(e.base), v(e, t, sa(r))))), R$1 in r && (s.push(O(e.base, R$1)), i.push(Ln(ya(e.base), v(e, t, e.type === 1 ? Z$2() : pa(r))))), B$1 in r && (s.push(O(e.base, B$1)), i.push(zt$1(r[B$1]))), q$2 in r && (s.push(O(e.base, q$2)), i.push(r[q$2] ? kt$1 : _t$1)), { k: s, v: i };
}
function le(e, t, r, n, s) {
  return wa(r, n, s, xe$2(e, t, n));
}
function bi(e, t, r, n) {
  return xn(r, v(e, t, n.valueOf()));
}
function yi(e, t, r, n) {
  return $n(r, n, v(e, t, n.buffer));
}
function wi(e, t, r, n) {
  return zn(r, n, v(e, t, n.buffer));
}
function vi(e, t, r, n) {
  return Pn(r, n, v(e, t, n.buffer));
}
function Ge$2(e, t, r, n) {
  let s = xt$1(n, e.base.features);
  return In(r, n, s ? xe$2(e, t, s) : a);
}
function Ei(e, t, r, n) {
  let s = xt$1(n, e.base.features);
  return On(r, n, s ? xe$2(e, t, s) : a);
}
function Si(e, t, r, n) {
  let s = [], i = [];
  for (let [o, u] of n.entries()) s.push(v(e, t, o)), i.push(v(e, t, u));
  return va(e.base, r, s, i);
}
function ki(e, t, r, n) {
  let s = [];
  for (let i of n.keys()) s.push(v(e, t, i));
  return Nn(r, s);
}
function _i(e, t, r, n) {
  let s = Un(r, U$1(e.base, 4), []);
  return e.type === 1 || (Pe$2(e), n.on({ next: (i) => {
    if (e.state.alive) {
      let o = N$1(e, t, i);
      o && V$1(e, Fn(r, o));
    }
  }, throw: (i) => {
    if (e.state.alive) {
      let o = N$1(e, t, i);
      o && V$1(e, Tn(r, o));
    }
    K(e);
  }, return: (i) => {
    if (e.state.alive) {
      let o = N$1(e, t, i);
      o && V$1(e, jn(r, o));
    }
    K(e);
  } })), s;
}
function Ri(e, t, r) {
  if (this.state.alive) {
    let n = N$1(this, t, r);
    n && V$1(this, g(23, e, a, a, a, a, a, [U$1(this.base, 2), n], a, a, a, a)), K(this);
  }
}
function Ai(e, t, r) {
  if (this.state.alive) {
    let n = N$1(this, t, r);
    n && V$1(this, g(24, e, a, a, a, a, a, [U$1(this.base, 3), n], a, a, a, a));
  }
  K(this);
}
function xi(e, t, r, n) {
  let s = jt(e.base, {});
  return e.type === 2 && (Pe$2(e), n.then(Ri.bind(e, s, t), Ai.bind(e, s, t))), Ea(e.base, r, s);
}
function $i(e, t, r, n, s) {
  for (let i = 0, o = s.length; i < o; i++) {
    let u = s[i];
    if (u.parse.sync && u.test(n)) return Pt$1(r, u.tag, u.parse.sync(n, new pi(e, t), { id: r }));
  }
  return a;
}
function zi(e, t, r, n, s) {
  for (let i = 0, o = s.length; i < o; i++) {
    let u = s[i];
    if (u.parse.stream && u.test(n)) return Pt$1(r, u.tag, u.parse.stream(n, new di(e, t), { id: r }));
  }
  return a;
}
function Zt(e, t, r, n) {
  let s = e.base.plugins;
  return s ? e.type === 1 ? $i(e, t, r, n, s) : zi(e, t, r, n, s) : a;
}
function Pi(e, t, r, n) {
  let s = [];
  for (let i = 0, o = n.v.length; i < o; i++) s[i] = v(e, t, n.v[i]);
  return Dn(r, s, n.t, n.d);
}
function Ii(e, t, r, n, s) {
  switch (s) {
    case Object:
      return le(e, t, r, n, false);
    case a:
      return le(e, t, r, n, true);
    case Date:
      return Sn(r, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return Ge$2(e, t, r, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return bi(e, t, r, n);
    case ArrayBuffer:
      return Sa(e.base, r, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return yi(e, t, r, n);
    case DataView:
      return vi(e, t, r, n);
    case Map:
      return Si(e, t, r, n);
    case Set:
      return ki(e, t, r, n);
  }
  if (s === Promise || n instanceof Promise) return xi(e, t, r, n);
  let i = e.base.features;
  if (i & 32 && s === RegExp) return kn(r, n);
  if (i & 16) switch (s) {
    case BigInt64Array:
    case BigUint64Array:
      return wi(e, t, r, n);
  }
  if (i & 1 && typeof AggregateError < "u" && (s === AggregateError || n instanceof AggregateError)) return Ei(e, t, r, n);
  if (n instanceof Error) return Ge$2(e, t, r, n);
  if (A in n || R$1 in n) return le(e, t, r, n, !!s);
  throw new ae(n);
}
function Oi(e, t, r, n) {
  if (Array.isArray(n)) return mi(e, t, r, n);
  if (ie(n)) return _i(e, t, r, n);
  if (aa(n)) return Pi(e, t, r, n);
  let s = n.constructor;
  return s === Jn ? v(e, t, n.replacement) : Zt(e, t, r, n) || Ii(e, t, r, n, s);
}
function Ni(e, t, r) {
  let n = Se$2(e.base, r);
  if (n.type !== 0) return n.value;
  let s = Zt(e, t, n.value, r);
  if (s) return s;
  throw new ae(r);
}
function v(e, t, r) {
  if (t >= e.base.depthLimit) throw new Nt$1(e.base.depthLimit);
  switch (typeof r) {
    case "boolean":
      return r ? kt$1 : _t$1;
    case "undefined":
      return sn;
    case "string":
      return zt$1(r);
    case "number":
      return wn(r);
    case "bigint":
      return vn(r);
    case "object": {
      if (r) {
        let n = Se$2(e.base, r);
        return n.type === 0 ? Oi(e, t + 1, n.value, r) : n.value;
      }
      return on;
    }
    case "symbol":
      return O(e.base, r);
    case "function":
      return Ni(e, t, r);
    default:
      throw new ae(r);
  }
}
function V$1(e, t) {
  e.state.initial ? e.state.buffer.push(t) : ze$3(e, t, false);
}
function $e$2(e, t) {
  if (e.state.onError) e.state.onError(t);
  else throw t instanceof je$2 ? t : new je$2(t);
}
function er(e) {
  e.state.onDone && e.state.onDone();
}
function ze$3(e, t, r) {
  try {
    e.state.onParse(t, r);
  } catch (n) {
    $e$2(e, n);
  }
}
function Pe$2(e) {
  e.state.pending++;
}
function K(e) {
  --e.state.pending <= 0 && er(e);
}
function N$1(e, t, r) {
  try {
    return v(e, t, r);
  } catch (n) {
    return $e$2(e, n), a;
  }
}
function tr(e, t) {
  let r = N$1(e, 0, t);
  r && (ze$3(e, r, true), e.state.initial = false, Ci(e, e.state), e.state.pending <= 0 && Ie$2(e));
}
function Ci(e, t) {
  for (let r = 0, n = t.buffer.length; r < n; r++) ze$3(e, t.buffer[r], false);
}
function Ie$2(e) {
  e.state.alive && (er(e), e.state.alive = false);
}
function Li(e, t) {
  let r = ke$1(t.plugins), n = Qt({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, onParse(s, i) {
    let o = _s({ plugins: r, features: n.base.features, scopeId: t.scopeId, markedRefs: n.base.marked }), u;
    try {
      u = fi(o, s);
    } catch (c) {
      t.onError && t.onError(c);
      return;
    }
    t.onSerialize(u, i);
  }, onError: t.onError, onDone: t.onDone });
  return tr(n, e), Ie$2.bind(null, n);
}
function Ui(e, t) {
  let r = ke$1(t.plugins), n = Qt({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, depthLimit: t.depthLimit, onParse: t.onParse, onError: t.onError, onDone: t.onDone });
  return tr(n, e), Ie$2.bind(null, n);
}
function Fi(e, t = {}) {
  var r;
  let n = ke$1(t.plugins), s = t.disabledFeatures || 0, i = (r = e.f) != null ? r : 63, o = Pa({ plugins: n, markedRefs: e.m, features: i & ~s, disabledFeatures: s });
  return ls(o, e.t);
}
var we$2 = (e) => {
  let t = new AbortController(), r = t.abort.bind(t);
  return e.then(r, r), t;
};
function Ti(e) {
  e(this.reason);
}
function ji(e) {
  this.addEventListener("abort", Ti.bind(this, e), { once: true });
}
function Ye$2(e) {
  return new Promise(ji.bind(e));
}
var G = {}, Di = { tag: "seroval-plugins/web/AbortControllerFactoryPlugin", test(e) {
  return e === G;
}, parse: { sync() {
  return G;
}, async async() {
  return await Promise.resolve(G);
}, stream() {
  return G;
} }, serialize() {
  return we$2.toString();
}, deserialize() {
  return we$2;
} }, Mi = { tag: "seroval-plugins/web/AbortSignal", extends: [Di], test(e) {
  return typeof AbortSignal > "u" ? false : e instanceof AbortSignal;
}, parse: { sync(e, t) {
  return e.aborted ? { reason: t.parse(e.reason) } : {};
}, async async(e, t) {
  if (e.aborted) return { reason: await t.parse(e.reason) };
  let r = await Ye$2(e);
  return { reason: await t.parse(r) };
}, stream(e, t) {
  if (e.aborted) return { reason: t.parse(e.reason) };
  let r = Ye$2(e);
  return { factory: t.parse(G), controller: t.parse(r) };
} }, serialize(e, t) {
  return e.reason ? "AbortSignal.abort(" + t.serialize(e.reason) + ")" : e.controller && e.factory ? "(" + t.serialize(e.factory) + ")(" + t.serialize(e.controller) + ").signal" : "(new AbortController).signal";
}, deserialize(e, t) {
  return e.reason ? AbortSignal.abort(t.deserialize(e.reason)) : e.controller ? we$2(t.deserialize(e.controller)).signal : new AbortController().signal;
} }, qi = Mi;
function fe(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Bi = { tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent > "u" ? false : e instanceof CustomEvent;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(fe(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(fe(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(fe(e)) };
} }, serialize(e, t) {
  return "new CustomEvent(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new CustomEvent(t.deserialize(e.type), t.deserialize(e.options));
} }, Vi = Bi, Hi = { tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException > "u" ? false : e instanceof DOMException;
}, parse: { sync(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
}, async async(e, t) {
  return { name: await t.parse(e.name), message: await t.parse(e.message) };
}, stream(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
} }, serialize(e, t) {
  return "new DOMException(" + t.serialize(e.message) + "," + t.serialize(e.name) + ")";
}, deserialize(e, t) {
  return new DOMException(t.deserialize(e.message), t.deserialize(e.name));
} }, Wi = Hi;
function pe$1(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Xi = { tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event > "u" ? false : e instanceof Event;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(pe$1(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(pe$1(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(pe$1(e)) };
} }, serialize(e, t) {
  return "new Event(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Event(t.deserialize(e.type), t.deserialize(e.options));
} }, Ji = Xi, Gi = { tag: "seroval-plugins/web/File", test(e) {
  return typeof File > "u" ? false : e instanceof File;
}, parse: { async async(e, t) {
  return { name: await t.parse(e.name), options: await t.parse({ type: e.type, lastModified: e.lastModified }), buffer: await t.parse(await e.arrayBuffer()) };
} }, serialize(e, t) {
  return "new File([" + t.serialize(e.buffer) + "]," + t.serialize(e.name) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new File([t.deserialize(e.buffer)], t.deserialize(e.name), t.deserialize(e.options));
} }, Yi = Gi;
function de$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var $$1 = {}, rr = (e, t = new FormData(), r = 0, n = e.length, s) => {
  for (; r < n; r++) s = e[r], t.append(s[0], s[1]);
  return t;
}, Ki = { tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === $$1;
}, parse: { sync() {
  return $$1;
}, async async() {
  return await Promise.resolve($$1);
}, stream() {
  return $$1;
} }, serialize() {
  return rr.toString();
}, deserialize() {
  return $$1;
} }, Qi = { tag: "seroval-plugins/web/FormData", extends: [Yi, Ki], test(e) {
  return typeof FormData > "u" ? false : e instanceof FormData;
}, parse: { sync(e, t) {
  return { factory: t.parse($$1), entries: t.parse(de$1(e)) };
}, async async(e, t) {
  return { factory: await t.parse($$1), entries: await t.parse(de$1(e)) };
}, stream(e, t) {
  return { factory: t.parse($$1), entries: t.parse(de$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.entries) + ")";
}, deserialize(e, t) {
  return rr(t.deserialize(e.entries));
} }, Zi = Qi;
function he$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var eo = { tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers > "u" ? false : e instanceof Headers;
}, parse: { sync(e, t) {
  return { value: t.parse(he$1(e)) };
}, async async(e, t) {
  return { value: await t.parse(he$1(e)) };
}, stream(e, t) {
  return { value: t.parse(he$1(e)) };
} }, serialize(e, t) {
  return "new Headers(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new Headers(t.deserialize(e.value));
} }, Oe$2 = eo, z$1 = {}, nr = (e) => new ReadableStream({ start: (t) => {
  e.on({ next: (r) => {
    try {
      t.enqueue(r);
    } catch {
    }
  }, throw: (r) => {
    t.error(r);
  }, return: () => {
    try {
      t.close();
    } catch {
    }
  } });
} }), to = { tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === z$1;
}, parse: { sync() {
  return z$1;
}, async async() {
  return await Promise.resolve(z$1);
}, stream() {
  return z$1;
} }, serialize() {
  return nr.toString();
}, deserialize() {
  return z$1;
} };
function Ke$3(e) {
  let t = Z$2(), r = e.getReader();
  async function n() {
    try {
      let s = await r.read();
      s.done ? t.return(s.value) : (t.next(s.value), await n());
    } catch (s) {
      t.throw(s);
    }
  }
  return n().catch(() => {
  }), t;
}
var ro = { tag: "seroval/plugins/web/ReadableStream", extends: [to], test(e) {
  return typeof ReadableStream > "u" ? false : e instanceof ReadableStream;
}, parse: { sync(e, t) {
  return { factory: t.parse(z$1), stream: t.parse(Z$2()) };
}, async async(e, t) {
  return { factory: await t.parse(z$1), stream: await t.parse(Ke$3(e)) };
}, stream(e, t) {
  return { factory: t.parse(z$1), stream: t.parse(Ke$3(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.stream) + ")";
}, deserialize(e, t) {
  let r = t.deserialize(e.stream);
  return nr(r);
} }, Ne$1 = ro;
function Qe$2(e, t) {
  return { body: t, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var no = { tag: "seroval-plugins/web/Request", extends: [Ne$1, Oe$2], test(e) {
  return typeof Request > "u" ? false : e instanceof Request;
}, parse: { async async(e, t) {
  return { url: await t.parse(e.url), options: await t.parse(Qe$2(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, t) {
  return { url: t.parse(e.url), options: t.parse(Qe$2(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, t) {
  return "new Request(" + t.serialize(e.url) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Request(t.deserialize(e.url), t.deserialize(e.options));
} }, ao = no;
function Ze$1(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var so = { tag: "seroval-plugins/web/Response", extends: [Ne$1, Oe$2], test(e) {
  return typeof Response > "u" ? false : e instanceof Response;
}, parse: { async async(e, t) {
  return { body: await t.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await t.parse(Ze$1(e)) };
}, stream(e, t) {
  return { body: t.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: t.parse(Ze$1(e)) };
} }, serialize(e, t) {
  return "new Response(" + t.serialize(e.body) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Response(t.deserialize(e.body), t.deserialize(e.options));
} }, io = so, oo = { tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL > "u" ? false : e instanceof URL;
}, parse: { sync(e, t) {
  return { value: t.parse(e.href) };
}, async async(e, t) {
  return { value: await t.parse(e.href) };
}, stream(e, t) {
  return { value: t.parse(e.href) };
} }, serialize(e, t) {
  return "new URL(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new URL(t.deserialize(e.value));
} }, uo = oo, co = { tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams > "u" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, t) {
  return { value: t.parse(e.toString()) };
}, async async(e, t) {
  return { value: await t.parse(e.toString()) };
}, stream(e, t) {
  return { value: t.parse(e.toString()) };
} }, serialize(e, t) {
  return "new URLSearchParams(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new URLSearchParams(t.deserialize(e.value));
} }, lo = co;
const Ce$2 = [qi, Vi, Wi, Ji, Zi, Oe$2, Ne$1, ao, io, lo, uo], fo = 64, ar = ft$1.RegExp;
function sr(e) {
  const t = new TextEncoder().encode(e), r = t.length, n = r.toString(16), s = "00000000".substring(0, 8 - n.length) + n, i = new TextEncoder().encode(`;0x${s};`), o = new Uint8Array(12 + r);
  return o.set(i), o.set(t, 12), o;
}
function et$1(e, t) {
  return new ReadableStream({ start(r) {
    Li(t, { scopeId: e, plugins: Ce$2, onSerialize(n, s) {
      r.enqueue(sr(s ? `(${hn(e)},${n})` : n));
    }, onDone() {
      r.close();
    }, onError(n) {
      r.error(n);
    } });
  } });
}
function po(e) {
  return new ReadableStream({ start(t) {
    Ui(e, { disabledFeatures: ar, depthLimit: fo, plugins: Ce$2, onParse(r) {
      t.enqueue(sr(JSON.stringify(r)));
    }, onDone() {
      t.close();
    }, onError(r) {
      t.error(r);
    } });
  } });
}
async function tt$1(e) {
  return Fi(JSON.parse(e), { plugins: Ce$2, disabledFeatures: ar });
}
async function ho(e) {
  const t = Je$3(e), r = t.request, n = r.headers.get("X-Server-Id"), s = r.headers.get("X-Server-Instance"), i = r.headers.has("X-Single-Flight"), o = new URL(r.url);
  let u, c;
  if (n) Ar(typeof n == "string", "Invalid server function"), [u, c] = decodeURIComponent(n).split("#");
  else if (u = o.searchParams.get("id"), c = o.searchParams.get("name"), !u || !c) return new Response(null, { status: 404 });
  const l = Zr[u];
  let p;
  if (!l) return new Response(null, { status: 404 });
  p = await l.importer();
  const d = p[l.functionName];
  let w = [];
  if (!s || e.method === "GET") {
    const f = o.searchParams.get("args");
    if (f) {
      const S = await tt$1(f);
      for (const ee of S) w.push(ee);
    }
  }
  if (e.method === "POST") {
    const f = r.headers.get("content-type"), S = e.node.req, ee = S instanceof ReadableStream, ir = S.body instanceof ReadableStream, or = ee && S.locked || ir && S.body.locked, ur = ee ? S : S.body, ue = or ? r : new Request(r, { ...r, body: ur });
    r.headers.get("x-serialized") ? w = await tt$1(await ue.text()) : (f == null ? void 0 : f.startsWith("multipart/form-data")) || (f == null ? void 0 : f.startsWith("application/x-www-form-urlencoded")) ? w.push(await ue.formData()) : (f == null ? void 0 : f.startsWith("application/json")) && (w = await ue.json());
  }
  try {
    let f = await provideRequestEvent(t, async () => (sharedConfig.context = { event: t }, t.locals.serverFunctionMeta = { id: u + "#" + c }, d(...w)));
    if (i && s && (f = await nt$1(t, f)), f instanceof Response) {
      if (f.headers && f.headers.has("X-Content-Raw")) return f;
      s && (f.headers && Ye$3(e, f.headers), f.status && (f.status < 300 || f.status >= 400) && I$2(e, f.status), f.customBody ? f = await f.customBody() : f.body == null && (f = null));
    }
    if (!s) return rt$1(f, r, w);
    return ze$4(e, "x-serialized", "true"), ze$4(e, "content-type", "text/javascript"), et$1(s, f);
    return po(f);
  } catch (f) {
    if (f instanceof Response) i && s && (f = await nt$1(t, f)), f.headers && Ye$3(e, f.headers), f.status && (!s || f.status < 300 || f.status >= 400) && I$2(e, f.status), f.customBody ? f = f.customBody() : f.body == null && (f = null), ze$4(e, "X-Error", "true");
    else if (s) {
      const S = f instanceof Error ? f.message : typeof f == "string" ? f : "true";
      ze$4(e, "X-Error", S.replace(/[\r\n]+/g, ""));
    } else f = rt$1(f, r, w, true);
    return s ? (ze$4(e, "x-serialized", "true"), ze$4(e, "content-type", "text/javascript"), et$1(s, f)) : f;
  }
}
function rt$1(e, t, r, n) {
  const s = new URL(t.url), i = e instanceof Error;
  let o = 302, u;
  return e instanceof Response ? (u = new Headers(e.headers), e.headers.has("Location") && (u.set("Location", new URL(e.headers.get("Location"), s.origin + "").toString()), o = Qr(e))) : u = new Headers({ Location: new URL(t.headers.get("referer")).toString() }), e && u.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: s.pathname + s.search, result: i ? e.message : e, thrown: n, error: i, input: [...r.slice(0, -1), [...r[r.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: o, headers: u });
}
let ge$1;
function go(e) {
  var _a3;
  const t = new Headers(e.request.headers), r = Ke$4(e.nativeEvent), n = e.response.headers.getSetCookie();
  t.delete("cookie");
  let s = false;
  return ((_a3 = e.nativeEvent.node) == null ? void 0 : _a3.req) && (s = true, e.nativeEvent.node.req.headers.cookie = ""), n.forEach((i) => {
    if (!i) return;
    const { maxAge: o, expires: u, name: c, value: l } = kr(i);
    if (o != null && o <= 0) {
      delete r[c];
      return;
    }
    if (u != null && u.getTime() <= Date.now()) {
      delete r[c];
      return;
    }
    r[c] = l;
  }), Object.entries(r).forEach(([i, o]) => {
    t.append("cookie", `${i}=${o}`), s && (e.nativeEvent.node.req.headers.cookie += `${i}=${o};`);
  }), t;
}
async function nt$1(e, t) {
  let r, n = new URL(e.request.headers.get("referer")).toString();
  t instanceof Response && (t.headers.has("X-Revalidate") && (r = t.headers.get("X-Revalidate").split(",")), t.headers.has("Location") && (n = new URL(t.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const s = qe$4(e);
  return s.request = new Request(n, { headers: go(e) }), await provideRequestEvent(s, async () => {
    await Yr(s), ge$1 || (ge$1 = (await import('../build/app-QqINhIlv.mjs')).default), s.router.dataOnly = r || true, s.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = s, ge$1();
      });
    } catch (u) {
      console.log(u);
    }
    const i = s.router.data;
    if (!i) return t;
    let o = false;
    for (const u in i) i[u] === void 0 ? delete i[u] : o = true;
    return o && (t instanceof Response ? t.customBody && (i._$value = t.customBody()) : (i._$value = t, t = new Response(null, { status: 200 })), t.customBody = () => i, t.headers.set("X-Single-Flight", "true")), t;
  });
}
const zo = eventHandler(ho);

function ye$1() {
  let t = /* @__PURE__ */ new Set();
  function e(r) {
    return t.add(r), () => t.delete(r);
  }
  let n = false;
  function s(r, o) {
    if (n) return !(n = false);
    const a = { to: r, options: o, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const c of t) c.listener({ ...a, from: c.location, retry: (f) => {
      f && (n = true), c.navigate(r, { ...o, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: e, confirm: s };
}
let D;
function V() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), D = window.history.state._depth;
}
isServer || V();
function qe$2(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function Ie$1(t, e) {
  let n = false;
  return () => {
    const s = D;
    V();
    const r = s == null ? null : D - s;
    if (n) {
      n = false;
      return;
    }
    r && e(r) ? (n = true, window.history.go(-r)) : t();
  };
}
const we$1 = /^(?:[a-z0-9]+:)?\/\//i, ve$1 = /^\/+|(\/)\/+$/g, Pe$1 = "http://sr";
function F$1(t, e = false) {
  const n = t.replace(ve$1, "$1");
  return n ? e || /^[?#]/.test(n) ? n : "/" + n : "";
}
function W$1(t, e, n) {
  if (we$1.test(e)) return;
  const s = F$1(t), r = n && F$1(n);
  let o = "";
  return !r || e.startsWith("/") ? o = s : r.toLowerCase().indexOf(s.toLowerCase()) !== 0 ? o = s + r : o = r, (o || "/") + F$1(e, !o);
}
function Re$1(t, e) {
  if (t == null) throw new Error(e);
  return t;
}
function xe$1(t, e) {
  return F$1(t).replace(/\/*(\*.*)?$/g, "") + F$1(e);
}
function Y$1(t) {
  const e = {};
  return t.searchParams.forEach((n, s) => {
    s in e ? Array.isArray(e[s]) ? e[s].push(n) : e[s] = [e[s], n] : e[s] = n;
  }), e;
}
function be$1(t, e, n) {
  const [s, r] = t.split("/*", 2), o = s.split("/").filter(Boolean), a = o.length;
  return (c) => {
    const f = c.split("/").filter(Boolean), h = f.length - a;
    if (h < 0 || h > 0 && r === void 0 && !e) return null;
    const l = { path: a ? "" : "/", params: {} }, m = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < a; d++) {
      const p = o[d], y = p[0] === ":", v = y ? f[d] : f[d].toLowerCase(), E = y ? p.slice(1) : p.toLowerCase();
      if (y && $(v, m(E))) l.params[E] = v;
      else if (y || !$(v, E)) return null;
      l.path += `/${v}`;
    }
    if (r) {
      const d = h ? f.slice(-h).join("/") : "";
      if ($(d, m(r))) l.params[r] = d;
      else return null;
    }
    return l;
  };
}
function $(t, e) {
  const n = (s) => s === t;
  return e === void 0 ? true : typeof e == "string" ? n(e) : typeof e == "function" ? e(t) : Array.isArray(e) ? e.some(n) : e instanceof RegExp ? e.test(t) : false;
}
function Ae$1(t) {
  const [e, n] = t.pattern.split("/*", 2), s = e.split("/").filter(Boolean);
  return s.reduce((r, o) => r + (o.startsWith(":") ? 2 : 3), s.length - (n === void 0 ? 0 : 1));
}
function Z$1(t) {
  const e = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(s, r) {
    return e.has(r) || runWithOwner(n, () => e.set(r, createMemo(() => t()[r]))), e.get(r)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(t());
  }, has(s, r) {
    return r in t();
  } });
}
function ee$1(t) {
  let e = /(\/?\:[^\/]+)\?/.exec(t);
  if (!e) return [t];
  let n = t.slice(0, e.index), s = t.slice(e.index + e[0].length);
  const r = [n, n += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(s); ) r.push(n += e[1]), s = s.slice(e[0].length);
  return ee$1(s).reduce((o, a) => [...o, ...r.map((c) => c + a)], []);
}
const Ce$1 = 100, Ee$1 = createContext$1(), te$1 = createContext$1(), L$1 = () => Re$1(useContext(Ee$1), "<A> and 'use' router primitives can be only used inside a Route."), Fe$1 = () => useContext(te$1) || L$1().base, We$1 = (t) => {
  const e = Fe$1();
  return createMemo(() => e.resolvePath(t()));
}, $e$1 = (t) => {
  const e = L$1();
  return createMemo(() => {
    const n = t();
    return n !== void 0 ? e.renderPath(n) : n;
  });
}, Me$1 = () => L$1().navigatorFactory(), De = () => L$1().location, Ue = () => L$1().params;
function Le$1(t, e = "") {
  const { component: n, preload: s, load: r, children: o, info: a } = t, c = !o || Array.isArray(o) && !o.length, f = { key: t, component: n, preload: s || r, info: a };
  return ne(t.path).reduce((h, l) => {
    for (const m of ee$1(l)) {
      const d = xe$1(e, m);
      let p = c ? d : d.split("/*", 1)[0];
      p = p.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), h.push({ ...f, originalPath: l, pattern: p, matcher: be$1(p, !c, t.matchFilters) });
    }
    return h;
  }, []);
}
function Se$1(t, e = 0) {
  return { routes: t, score: Ae$1(t[t.length - 1]) * 1e4 - e, matcher(n) {
    const s = [];
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r], a = o.matcher(n);
      if (!a) return null;
      s.unshift({ ...a, route: o });
    }
    return s;
  } };
}
function ne(t) {
  return Array.isArray(t) ? t : [t];
}
function Oe$1(t, e = "", n = [], s = []) {
  const r = ne(t);
  for (let o = 0, a = r.length; o < a; o++) {
    const c = r[o];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const f = Le$1(c, e);
      for (const h of f) {
        n.push(h);
        const l = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !l) Oe$1(c.children, h.pattern, n, s);
        else {
          const m = Se$1([...n], s.length);
          s.push(m);
        }
        n.pop();
      }
    }
  }
  return n.length ? s : s.sort((o, a) => a.score - o.score);
}
function M$1(t, e) {
  for (let n = 0, s = t.length; n < s; n++) {
    const r = t[n].matcher(e);
    if (r) return r;
  }
  return [];
}
function _e$1(t, e, n) {
  const s = new URL(Pe$1), r = createMemo((l) => {
    const m = t();
    try {
      return new URL(m, s);
    } catch {
      return console.error(`Invalid path ${m}`), l;
    }
  }, s, { equals: (l, m) => l.href === m.href }), o = createMemo(() => r().pathname), a = createMemo(() => r().search, true), c = createMemo(() => r().hash), f = () => "", h = on$1(a, () => Y$1(r()));
  return { get pathname() {
    return o();
  }, get search() {
    return a();
  }, get hash() {
    return c();
  }, get state() {
    return e();
  }, get key() {
    return f();
  }, query: n ? n(h) : Z$1(h) };
}
let P$1;
function ze$2() {
  return P$1;
}
let C$1 = false;
function He$2() {
  return C$1;
}
function Ke$2(t) {
  C$1 = t;
}
function Ne(t, e, n, s = {}) {
  const { signal: [r, o], utils: a = {} } = t, c = a.parsePath || ((i) => i), f = a.renderPath || ((i) => i), h = a.beforeLeave || ye$1(), l = W$1("", s.base || "");
  if (l === void 0) throw new Error(`${l} is not a valid base path`);
  l && !r().value && o({ value: l, replace: true, scroll: false });
  const [m, d] = createSignal(false);
  let p;
  const y = (i, u) => {
    u.value === v() && u.state === S() || (p === void 0 && d(true), P$1 = i, p = u, startTransition(() => {
      p === u && (E(p.value), re(p.state), resetErrorBoundaries(), isServer || z[1]((g) => g.filter((R) => R.pending)));
    }).finally(() => {
      p === u && batch(() => {
        P$1 = void 0, i === "navigate" && ie(p), d(false), p = void 0;
      });
    }));
  }, [v, E] = createSignal(r().value), [S, re] = createSignal(r().state), O = _e$1(v, S, a.queryWrapper), _ = [], z = createSignal(isServer ? ue() : []), H = createMemo(() => typeof s.transformUrl == "function" ? M$1(e(), s.transformUrl(O.pathname)) : M$1(e(), O.pathname)), K = () => {
    const i = H(), u = {};
    for (let g = 0; g < i.length; g++) Object.assign(u, i[g].params);
    return u;
  }, se = a.paramsWrapper ? a.paramsWrapper(K, e) : Z$1(K), N = { pattern: l, path: () => l, outlet: () => null, resolvePath(i) {
    return W$1(l, i);
  } };
  return createRenderEffect(on$1(r, (i) => y("native", i), { defer: true })), { base: N, location: O, params: se, isRouting: m, renderPath: f, parsePath: c, navigatorFactory: ae, matches: H, beforeLeave: h, preloadRoute: ce, singleFlight: s.singleFlight === void 0 ? true : s.singleFlight, submissions: z };
  function oe(i, u, g) {
    untrack(() => {
      if (typeof u == "number") {
        u && (a.go ? a.go(u) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const R = !u || u[0] === "?", { replace: j, resolve: x, scroll: B, state: b } = { replace: false, resolve: !R, scroll: true, ...g }, A = x ? i.resolvePath(u) : W$1(R && O.pathname || "", u);
      if (A === void 0) throw new Error(`Path '${u}' is not a routable path`);
      if (_.length >= Ce$1) throw new Error("Too many redirects");
      const T = v();
      if (A !== T || b !== S()) if (isServer) {
        const k = getRequestEvent();
        k && (k.response = { status: 302, headers: new Headers({ Location: A }) }), o({ value: A, replace: j, scroll: B, state: b });
      } else h.confirm(A, g) && (_.push({ value: T, replace: j, scroll: B, state: S() }), y("navigate", { value: A, state: b }));
    });
  }
  function ae(i) {
    return i = i || useContext(te$1) || N, (u, g) => oe(i, u, g);
  }
  function ie(i) {
    const u = _[0];
    u && (o({ ...i, replace: u.replace, scroll: u.scroll }), _.length = 0);
  }
  function ce(i, u) {
    const g = M$1(e(), i.pathname), R = P$1;
    P$1 = "preload";
    for (let j in g) {
      const { route: x, params: B } = g[j];
      x.component && x.component.preload && x.component.preload();
      const { preload: b } = x;
      C$1 = true, u && b && runWithOwner(n(), () => b({ params: B, location: { pathname: i.pathname, search: i.search, hash: i.hash, query: Y$1(i), state: null, key: "" }, intent: "preload" })), C$1 = false;
    }
    P$1 = R;
  }
  function ue() {
    const i = getRequestEvent();
    return i && i.router && i.router.submission ? [i.router.submission] : [];
  }
}
function Te$1(t, e, n, s) {
  const { base: r, location: o, params: a } = t, { pattern: c, component: f, preload: h } = s().route, l = createMemo(() => s().path);
  f && f.preload && f.preload(), C$1 = true;
  const m = h ? h({ params: a, location: o, intent: P$1 || "initial" }) : void 0;
  return C$1 = false, { parent: e, pattern: c, path: l, outlet: () => f ? createComponent(f, { params: a, location: o, data: m, get children() {
    return n();
  } }) : n(), resolvePath(p) {
    return W$1(r.path(), p, l());
  } };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function de(t = {}) {
  let e, n = false;
  const s = (r) => {
    if (e && e !== r) throw new Error("Context conflict");
  };
  let a;
  if (t.asyncContext) {
    const r = t.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    r ? a = new r() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const i = () => {
    if (a) {
      const r = a.getStore();
      if (r !== void 0) return r;
    }
    return e;
  };
  return { use: () => {
    const r = i();
    if (r === void 0) throw new Error("Context is not available");
    return r;
  }, tryUse: () => i(), set: (r, p) => {
    p || s(r), e = r, n = true;
  }, unset: () => {
    e = void 0, n = false;
  }, call: (r, p) => {
    s(r), e = r;
    try {
      return a ? a.run(r, p) : p();
    } finally {
      n || (e = void 0);
    }
  }, async callAsync(r, p) {
    e = r;
    const y = () => {
      e = r;
    }, R = () => e === r ? y : void 0;
    L.add(R);
    try {
      const f = a ? a.run(r, p) : p();
      return n || (e = void 0), await f;
    } finally {
      L.delete(R);
    }
  } };
}
function pe(t = {}) {
  const e = {};
  return { get(n, s = {}) {
    return e[n] || (e[n] = de({ ...t, ...s })), e[n];
  } };
}
const E = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, P = "__unctx__", he = E[P] || (E[P] = pe()), ge = (t, e = {}) => he.get(t, e), k = "__unctx_async_handlers__", L = E[k] || (E[k] = /* @__PURE__ */ new Set());
function ye(t) {
  let e;
  const n = N(t), s = { duplex: "half", method: t.method, headers: t.headers };
  return t.node.req.body instanceof ArrayBuffer ? new Request(n, { ...s, body: t.node.req.body }) : new Request(n, { ...s, get body() {
    return e || (e = Ce(t), e);
  } });
}
function Re(t) {
  var _a;
  return (_a = t.web) != null ? _a : t.web = { request: ye(t), url: N(t) }, t.web.request;
}
function me() {
  return _e();
}
const M = /* @__PURE__ */ Symbol("$HTTPEvent");
function we(t) {
  return typeof t == "object" && (t instanceof H3Event || (t == null ? void 0 : t[M]) instanceof H3Event || (t == null ? void 0 : t.__is_event__) === true);
}
function u(t) {
  return function(...e) {
    var _a;
    let n = e[0];
    if (we(n)) e[0] = n instanceof H3Event || n.__is_event__ ? n : n[M];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (n = me(), !n) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      e.unshift(n);
    }
    return t(...e);
  };
}
const N = u(getRequestURL), be = u(getRequestIP), I = u(setResponseStatus), j$1 = u(getResponseStatus), xe = u(getResponseStatusText), C = u(getResponseHeaders), U = u(getResponseHeader), Se = u(setResponseHeader), ve = u(appendResponseHeader), Ke$1 = u(sendRedirect), Be$1 = u(getCookie), Ge$1 = u(setCookie), ze$1 = u(setHeader), Ce = u(getRequestWebStream), Ee = u(removeResponseHeader), He$1 = u(Re);
function Te() {
  var _a;
  return ge("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function _e() {
  return Te().use().event;
}
const _$1 = "solidFetchEvent";
function Ae(t) {
  return { request: He$1(t), response: $e(t), clientAddress: be(t), locals: {}, nativeEvent: t };
}
function qe$1(t) {
  return { ...t };
}
function Je$1(t) {
  if (!t.context[_$1]) {
    const e = Ae(t);
    t.context[_$1] = e;
  }
  return t.context[_$1];
}
class Oe {
  constructor(e) {
    __publicField(this, "event");
    this.event = e;
  }
  get(e) {
    const n = U(this.event, e);
    return Array.isArray(n) ? n.join(", ") : n || null;
  }
  has(e) {
    return this.get(e) !== null;
  }
  set(e, n) {
    return Se(this.event, e, n);
  }
  delete(e) {
    return Ee(this.event, e);
  }
  append(e, n) {
    ve(this.event, e, n);
  }
  getSetCookie() {
    const e = U(this.event, "Set-Cookie");
    return Array.isArray(e) ? e : [e];
  }
  forEach(e) {
    return Object.entries(C(this.event)).forEach(([n, s]) => e(Array.isArray(s) ? s.join(", ") : s, n, this));
  }
  entries() {
    return Object.entries(C(this.event)).map(([e, n]) => [e, Array.isArray(n) ? n.join(", ") : n])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(C(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(C(this.event)).map((e) => Array.isArray(e) ? e.join(", ") : e)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function $e(t) {
  return { get status() {
    return j$1(t);
  }, set status(e) {
    I(t, e);
  }, get statusText() {
    return xe(t);
  }, set statusText(e) {
    I(t, j$1(t), e);
  }, headers: new Oe(t) };
}
function Ye$1(t, e, n) {
  if (typeof t != "function") throw new Error("Export from a 'use server' module must be a function");
  const s = "";
  return new Proxy(t, { get(a, i, r) {
    return i === "url" ? `${s}/_server?id=${encodeURIComponent(e)}&name=${encodeURIComponent(n)}` : i === "GET" ? r : a[i];
  }, apply(a, i, r) {
    const p = getRequestEvent();
    if (!p) throw new Error("Cannot call server function outside of a request");
    const y = qe$1(p);
    return y.locals.serverFunctionMeta = { id: e + "#" + n }, y.serverOnly = true, provideRequestEvent(y, () => t.apply(i, r));
  } });
}
const Pe = "Location", ke = 5e3, Le = 18e4;
let q$1 = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const t = Date.now();
  for (let [e, n] of q$1.entries()) !n[4].count && t - n[0] > Le && q$1.delete(e);
}, 3e5);
function x() {
  if (!isServer) return q$1;
  const t = getRequestEvent();
  if (!t) throw new Error("Cannot find cache context");
  return (t.router || (t.router = {})).cache || (t.router.cache = /* @__PURE__ */ new Map());
}
function S(t, e) {
  t.GET && (t = t.GET);
  const n = (...s) => {
    const a = x(), i = ze$2(), r = He$2(), y = getOwner() ? Me$1() : void 0, R = Date.now(), f = e + F(s);
    let o = a.get(f), H;
    if (isServer) {
      const c = getRequestEvent();
      if (c) {
        const d = (c.router || (c.router = {})).dataOnly;
        if (d) {
          const g = c && (c.router.data || (c.router.data = {}));
          if (g && f in g) return g[f];
          if (Array.isArray(d) && !Ie(f, d)) return g[f] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (H = true, onCleanup(() => o[4].count--)), o && o[0] && (isServer || i === "native" || o[4].count || Date.now() - o[0] < ke)) {
      H && (o[4].count++, o[4][0]()), o[3] === "preload" && i !== "preload" && (o[0] = R);
      let c = o[1];
      return i !== "preload" && (c = "then" in o[1] ? o[1].then(w(false), w(true)) : w(false)(o[1]), !isServer && i === "navigate" && startTransition(() => o[4][1](o[0]))), r && "then" in c && c.catch(() => {
      }), c;
    }
    let l;
    if (!isServer && sharedConfig.has && sharedConfig.has(f) ? (l = sharedConfig.load(f), delete globalThis._$HY.r[f]) : l = t(...s), o ? (o[0] = R, o[1] = l, o[3] = i, !isServer && i === "navigate" && startTransition(() => o[4][1](o[0]))) : (a.set(f, o = [R, l, , i, createSignal(R)]), o[4].count = 0), H && (o[4].count++, o[4][0]()), isServer) {
      const c = getRequestEvent();
      if (c && c.router.dataOnly) return c.router.data[f] = l;
    }
    if (i !== "preload" && (l = "then" in l ? l.then(w(false), w(true)) : w(false)(l)), r && "then" in l && l.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const c = getRequestEvent();
      (!c || !c.serverOnly) && sharedConfig.context.serialize(f, l);
    }
    return l;
    function w(c) {
      return async (d) => {
        if (d instanceof Response) {
          const g = getRequestEvent();
          if (g) for (const [O, $] of d.headers) O == "set-cookie" ? g.response.headers.append("set-cookie", $) : g.response.headers.set(O, $);
          const v = d.headers.get(Pe);
          if (v !== null) {
            y && v.startsWith("/") ? startTransition(() => {
              y(v, { replace: true });
            }) : isServer ? g && (g.response.status = 302) : window.location.href = v;
            return;
          }
          d.customBody && (d = await d.customBody());
        }
        if (c) throw d;
        return o[2] = d, d;
      };
    }
  };
  return n.keyFor = (...s) => e + F(s), n.key = e, n;
}
S.get = (t) => x().get(t)[2];
S.set = (t, e) => {
  const n = x(), s = Date.now();
  let a = n.get(t);
  a ? (a[0] = s, a[1] = Promise.resolve(e), a[2] = e, a[3] = "preload") : (n.set(t, a = [s, Promise.resolve(e), e, "preload", createSignal(s)]), a[4].count = 0);
};
S.delete = (t) => x().delete(t);
S.clear = () => x().clear();
const Qe$1 = S;
function Ie(t, e) {
  for (let n of e) if (n && t.startsWith(n)) return true;
  return false;
}
function F(t) {
  return JSON.stringify(t, (e, n) => je$1(n) ? Object.keys(n).sort().reduce((s, a) => (s[a] = n[a], s), {}) : n);
}
function je$1(t) {
  let e;
  return t != null && typeof t == "object" && (!(e = Object.getPrototypeOf(t)) || e === Object.prototype);
}

var _a, _b;
const R = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function Me(e = {}) {
  const t = { options: e, rootNode: Y(), staticRoutesMap: {} }, r = (s) => e.strictTrailingSlash ? s : s.replace(/\/$/, "") || "/";
  if (e.routes) for (const s in e.routes) H(t, r(s), e.routes[s]);
  return { ctx: t, lookup: (s) => Fe(t, r(s)), insert: (s, n) => H(t, r(s), n), remove: (s) => He(t, r(s)) };
}
function Fe(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const s = t.split("/"), n = {};
  let o = false, i = null, a = e.rootNode, l = null;
  for (let c = 0; c < s.length; c++) {
    const f = s[c];
    a.wildcardChildNode !== null && (i = a.wildcardChildNode, l = s.slice(c).join("/"));
    const v = a.children.get(f);
    if (v === void 0) {
      if (a && a.placeholderChildren.length > 1) {
        const y = s.length - c;
        a = a.placeholderChildren.find((m) => m.maxDepth === y) || null;
      } else a = a.placeholderChildren[0] || null;
      if (!a) break;
      a.paramName && (n[a.paramName] = f), o = true;
    } else a = v;
  }
  return (a === null || a.data === null) && i !== null && (a = i, n[a.paramName || "_"] = l, o = true), a ? o ? { ...a.data, params: o ? n : void 0 } : a.data : null;
}
function H(e, t, r) {
  let s = true;
  const n = t.split("/");
  let o = e.rootNode, i = 0;
  const a = [o];
  for (const l of n) {
    let c;
    if (c = o.children.get(l)) o = c;
    else {
      const f = qe(l);
      c = Y({ type: f, parent: o }), o.children.set(l, c), f === R.PLACEHOLDER ? (c.paramName = l === "*" ? `_${i++}` : l.slice(1), o.placeholderChildren.push(c), s = false) : f === R.WILDCARD && (o.wildcardChildNode = c, c.paramName = l.slice(3) || "_", s = false), a.push(c), o = c;
    }
  }
  for (const [l, c] of a.entries()) c.maxDepth = Math.max(a.length - l, c.maxDepth || 0);
  return o.data = r, s === true && (e.staticRoutesMap[t] = o), o;
}
function He(e, t) {
  let r = false;
  const s = t.split("/");
  let n = e.rootNode;
  for (const o of s) if (n = n.children.get(o), !n) return r;
  if (n.data) {
    const o = s.at(-1) || "";
    n.data = null, Object.keys(n.children).length === 0 && n.parent && (n.parent.children.delete(o), n.parent.wildcardChildNode = null, n.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function Y(e = {}) {
  return { type: e.type || R.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function qe(e) {
  return e.startsWith("**") ? R.WILDCARD : e[0] === ":" || e === "*" ? R.PLACEHOLDER : R.NORMAL;
}
const Q = (e) => (t) => {
  const { base: r } = t, s = children(() => t.children), n = createMemo(() => Oe$1(s(), t.base || ""));
  let o;
  const i = Ne(e, n, () => o, { base: r, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(i), createComponent$1(Ee$1.Provider, { value: i, get children() {
    return createComponent$1(je, { routerState: i, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(o = getOwner()) && null, createComponent$1(Be, { routerState: i, get branches() {
        return n();
      } })];
    } });
  } });
};
function je(e) {
  const t = e.routerState.location, r = e.routerState.params, s = createMemo(() => e.preload && untrack(() => {
    Ke$2(true), e.preload({ params: r, location: t, intent: ze$2() || "initial" }), Ke$2(false);
  }));
  return createComponent$1(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (n) => createComponent$1(n, { params: r, location: t, get data() {
    return s();
  }, get children() {
    return e.children;
  } }) });
}
function Be(e) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      We(n, e.routerState, e.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = e.routerState.matches().map(({ route: o, path: i, params: a }) => ({ path: o.originalPath, pattern: o.pattern, match: i, params: a, info: o.info }))));
  }
  const t = [];
  let r;
  const s = createMemo(on$1(e.routerState.matches, (n, o, i) => {
    let a = o && n.length === o.length;
    const l = [];
    for (let c = 0, f = n.length; c < f; c++) {
      const v = o && o[c], y = n[c];
      i && v && y.route.key === v.route.key ? l[c] = i[c] : (a = false, t[c] && t[c](), createRoot((m) => {
        t[c] = m, l[c] = Te$1(e.routerState, l[c - 1] || e.routerState.base, q(() => s()[c + 1]), () => {
          var _a2;
          const w = e.routerState.matches();
          return (_a2 = w[c]) != null ? _a2 : w[0];
        });
      }));
    }
    return t.splice(n.length).forEach((c) => c()), i && a ? i : (r = l[0], l);
  }));
  return q(() => s() && r)();
}
const q = (e) => () => createComponent$1(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent$1(te$1.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function We(e, t, r) {
  const s = new URL(e.request.url), n = M$1(r, new URL(e.router.previousUrl || e.request.url).pathname), o = M$1(r, s.pathname);
  for (let i = 0; i < o.length; i++) {
    (!n[i] || o[i].route !== n[i].route) && (e.router.dataOnly = true);
    const { route: a, params: l } = o[i];
    a.preload && a.preload({ params: l, location: t.location, intent: "preload" });
  }
}
function ze([e, t], r, s) {
  return [e, s ? (n) => t(s(n)) : t];
}
function Ke(e) {
  let t = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, s = ze(createSignal(r(e.get()), { equals: (n, o) => n.value === o.value && n.state === o.state }), void 0, (n) => (!t && e.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return e.init && onCleanup(e.init((n = e.get()) => {
    t = true, s[1](r(n)), t = false;
  })), Q({ signal: s, create: e.create, utils: e.utils });
}
function Ge(e, t, r) {
  return e.addEventListener(t, r), () => e.removeEventListener(t, r);
}
function Je(e, t) {
  const r = e && document.getElementById(e);
  r ? r.scrollIntoView() : t && window.scrollTo(0, 0);
}
function Ve(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function Ye(e) {
  let t;
  const r = { value: e.url || (t = getRequestEvent()) && Ve(t.request.url) || "" };
  return Q({ signal: [() => r, (s) => Object.assign(r, s)] })(e);
}
const Qe = /* @__PURE__ */ new Map();
function Xe(e = true, t = false, r = "/_server", s) {
  return (n) => {
    const o = n.base.path(), i = n.navigatorFactory(n.base);
    let a, l;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function f(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const d = u.composedPath().find((D) => D instanceof Node && D.nodeName.toUpperCase() === "A");
      if (!d || t && !d.hasAttribute("link")) return;
      const g = c(d), p = g ? d.href.baseVal : d.href;
      if ((g ? d.target.baseVal : d.target) || !p && !d.hasAttribute("state")) return;
      const S = (d.getAttribute("rel") || "").split(/\s+/);
      if (d.hasAttribute("download") || S && S.includes("external")) return;
      const C = g ? new URL(p, document.baseURI) : new URL(p);
      if (!(C.origin !== window.location.origin || o && C.pathname && !C.pathname.toLowerCase().startsWith(o.toLowerCase()))) return [d, C];
    }
    function v(u) {
      const d = f(u);
      if (!d) return;
      const [g, p] = d, O = n.parsePath(p.pathname + p.search + p.hash), S = g.getAttribute("state");
      u.preventDefault(), i(O, { resolve: false, replace: g.hasAttribute("replace"), scroll: !g.hasAttribute("noscroll"), state: S ? JSON.parse(S) : void 0 });
    }
    function y(u) {
      const d = f(u);
      if (!d) return;
      const [g, p] = d;
      s && (p.pathname = s(p.pathname)), n.preloadRoute(p, g.getAttribute("preload") !== "false");
    }
    function m(u) {
      clearTimeout(a);
      const d = f(u);
      if (!d) return l = null;
      const [g, p] = d;
      l !== g && (s && (p.pathname = s(p.pathname)), a = setTimeout(() => {
        n.preloadRoute(p, g.getAttribute("preload") !== "false"), l = g;
      }, 20));
    }
    function w(u) {
      if (u.defaultPrevented) return;
      let d = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!d) return;
      if (!d.startsWith("https://action/")) {
        const p = new URL(d, Pe$1);
        if (d = n.parsePath(p.pathname + p.search), !d.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const g = Qe.get(d);
      if (g) {
        u.preventDefault();
        const p = new FormData(u.target, u.submitter);
        g.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? p : new URLSearchParams(p));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", v), e && (document.addEventListener("mousemove", m, { passive: true }), document.addEventListener("focusin", y, { passive: true }), document.addEventListener("touchstart", y, { passive: true })), document.addEventListener("submit", w), onCleanup(() => {
      document.removeEventListener("click", v), e && (document.removeEventListener("mousemove", m), document.removeEventListener("focusin", y), document.removeEventListener("touchstart", y)), document.removeEventListener("submit", w);
    });
  };
}
function Ze(e) {
  if (isServer) return Ye(e);
  const t = () => {
    const s = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: s + window.location.hash, state: n };
  }, r = ye$1();
  return Ke({ get: t, set({ value: s, replace: n, scroll: o, state: i }) {
    n ? window.history.replaceState(qe$2(i), "", s) : window.history.pushState(i, "", s), Je(decodeURIComponent(window.location.hash.slice(1)), o), V();
  }, init: (s) => Ge(window, "popstate", Ie$1(s, (n) => {
    if (n) return !r.confirm(n);
    {
      const o = t();
      return !r.confirm(o.value, { state: o.state });
    }
  })), create: Xe(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (s) => window.history.go(s), beforeLeave: r } })(e);
}
const et = {}, tt = (_a = et.VITE_API_URL) != null ? _a : "http://localhost:3000", rt = Ye$1(async () => {
  try {
    const e = await fetch(`${tt}/products`);
    return e.ok ? (await e.json()).data : [];
  } catch {
    return [];
  }
}, "src_routes_index_tsx--getProducts_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx?pick=route&tsr-directive-use-server="), nt = Qe$1(rt, "products"), st = { preload: () => nt() }, ot = {}, at = (_b = ot.VITE_API_URL) != null ? _b : "http://localhost:3000", it = Ye$1(async (e) => {
  try {
    const t = await fetch(`${at}/products/${e}`);
    return t.ok ? (await t.json()).data : null;
  } catch {
    return null;
  }
}, "src_routes_products_id_tsx--getProduct_cache", "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx?pick=route&tsr-directive-use-server="), ct = Qe$1(it, "product"), lt = { preload: ({ params: e }) => ct(e.id) }, X = [{ page: true, $component: { src: "src/routes/cart.tsx?pick=default&pick=$css", build: () => import('../build/cart2.mjs'), import: () => import('../build/cart2.mjs') }, path: "/cart", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/cart.tsx" }, { page: true, $component: { src: "src/routes/filter.tsx?pick=default&pick=$css", build: () => import('../build/filter2.mjs'), import: () => import('../build/filter2.mjs') }, path: "/filter", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/filter.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index2.mjs'), import: () => import('../build/index2.mjs') }, $$route: { require: () => ({ route: st }), src: "src/routes/index.tsx?pick=route" }, path: "/", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/products/[id].tsx?pick=default&pick=$css", build: () => import('../build/_id_2.mjs'), import: () => import('../build/_id_2.mjs') }, $$route: { require: () => ({ route: lt }), src: "src/routes/products/[id].tsx?pick=route" }, path: "/products/:id", filePath: "/Users/tobiasbelch/workspaces/fea/education/web-framework-benchmark-2026/packages/solidstart/src/routes/products/[id].tsx" }], ut = dt(X.filter((e) => e.page));
function dt(e) {
  function t(r, s, n, o) {
    const i = Object.values(r).find((a) => n.startsWith(a.id + "/"));
    return i ? (t(i.children || (i.children = []), s, n.slice(i.id.length)), r) : (r.push({ ...s, id: n, path: n.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, s) => r.path.length - s.path.length).reduce((r, s) => t(r, s, s.path, s.path), []);
}
function ht(e, t) {
  const r = ft.lookup(e);
  if (r && r.route) {
    const s = r.route, n = t === "HEAD" ? s.$HEAD || s.$GET : s[`$${t}`];
    if (n === void 0) return;
    const o = s.page === true && s.$component !== void 0;
    return { handler: n, params: r.params, isPage: o };
  }
}
function pt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const ft = Me({ routes: X.reduce((e, t) => {
  if (!pt(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (s, n) => `**:${n}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) });
var gt = " ";
const wt = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(gt), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function T$1(e, t) {
  let { tag: r, attrs: { key: s, ...n } = { key: void 0 }, children: o } = e;
  return wt[r]({ attrs: { ...n, nonce: t }, key: s, children: o });
}
function bt(e, t, r, s = "default") {
  return lazy(async () => {
    var _a2;
    {
      const o = (await e.import())[s], a = (await ((_a2 = t.inputs) == null ? void 0 : _a2[e.src].assets())).filter((c) => c.tag === "style" || c.attrs.rel === "stylesheet");
      return { default: (c) => [...a.map((f) => T$1(f)), createComponent(o, c)] };
    }
  });
}
function Z() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && bt(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return ut.map(e);
}
let j;
const vt = isServer ? () => getRequestEvent().routes : () => j || (j = Z());
function yt(e) {
  const t = Be$1(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const s = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], n = r.error ? new Error(r.result) : r.result;
    return { input: s, url: r.url, pending: false, result: r.thrown ? void 0 : n, error: r.thrown ? n : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    Ge$1(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Et(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: yt(e) }, routes: Z(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const $t = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function _(e) {
  return e.status && $t.has(e.status) ? e.status : 302;
}
function kt(e, t, r = {}, s) {
  return eventHandler({ handler: (n) => {
    const o = Je$1(n);
    return provideRequestEvent(o, async () => {
      const i = ht(new URL(o.request.url).pathname, o.request.method);
      if (i) {
        const m = await i.handler.import(), w = o.request.method === "HEAD" ? m.HEAD || m.GET : m[o.request.method];
        o.params = i.params || {}, sharedConfig.context = { event: o };
        const u = await w(o);
        if (u !== void 0) return u;
        if (o.request.method !== "GET") throw new Error(`API handler for ${o.request.method} "${o.request.url}" did not return a response.`);
        if (!i.isPage) return;
      }
      const a = await t(o), l = typeof r == "function" ? await r(a) : { ...r }, c = l.mode || "stream";
      if (l.nonce && (a.nonce = l.nonce), c === "sync") {
        const m = renderToString(() => (sharedConfig.context.event = a, e(a)), l);
        if (a.complete = true, a.response && a.response.headers.get("Location")) {
          const w = _(a.response);
          return Ke$1(n, a.response.headers.get("Location"), w);
        }
        return m;
      }
      if (l.onCompleteAll) {
        const m = l.onCompleteAll;
        l.onCompleteAll = (w) => {
          W(a)(w), m(w);
        };
      } else l.onCompleteAll = W(a);
      if (l.onCompleteShell) {
        const m = l.onCompleteShell;
        l.onCompleteShell = (w) => {
          B(a, n)(), m(w);
        };
      } else l.onCompleteShell = B(a, n);
      const f = renderToStream(() => (sharedConfig.context.event = a, e(a)), l);
      if (a.response && a.response.headers.get("Location")) {
        const m = _(a.response);
        return Ke$1(n, a.response.headers.get("Location"), m);
      }
      if (c === "async") return f;
      const { writable: v, readable: y } = new TransformStream();
      return f.pipeTo(v), y;
    });
  } });
}
function B(e, t) {
  return () => {
    if (e.response && e.response.headers.get("Location")) {
      const r = _(e.response);
      I(t, r), ze$1(t, "Location", e.response.headers.get("Location"));
    }
  };
}
function W(e) {
  return ({ write: t }) => {
    e.complete = true;
    const r = e.response && e.response.headers.get("Location");
    r && t(`<script>window.location="${r}"<\/script>`);
  };
}
function Rt(e, t, r) {
  return kt(e, Et, t);
}
var St = ["<nav", ' class="bg-white border-b border-gray-200 shadow-sm"><div class="max-w-7xl mx-auto px-4 py-3 flex gap-6"><a href="/" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Products</a><a href="/filter" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Filter</a><a href="/cart" class="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">Cart</a></div></nav>'], At = ["<main", ' class="max-w-7xl mx-auto px-4 py-8">', "</main>"];
function xt() {
  return createComponent$1(Ze, { root: (e) => [ssr(St, ssrHydrationKey()), ssr(At, ssrHydrationKey(), escape(createComponent$1(Suspense, { get children() {
    return e.children;
  } })))], get children() {
    return createComponent$1(vt, {});
  } });
}
const ee = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var Ct = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], Pt = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const Lt = (e) => {
  const t = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (r) => (console.error(r), [ssr(Ct, ssrHydrationKey(), escape(t)), createComponent$1(ee, { code: 500 })]), get children() {
    return e.children;
  } });
}, Tt = (e) => {
  let t = false;
  const r = catchError(() => e.children, (s) => {
    console.error(s), t = !!s;
  });
  return t ? [ssr(Pt, ssrHydrationKey()), createComponent$1(ee, { code: 500 })] : r;
};
var z = ["<script", ">", "<\/script>"], _t = ["<script", ' type="module"', " async", "><\/script>"], Nt = ["<script", ' type="module" async', "><\/script>"];
const It = ssr("<!DOCTYPE html>");
function te(e, t, r = []) {
  for (let s = 0; s < t.length; s++) {
    const n = t[s];
    if (n.path !== e[0].path) continue;
    let o = [...r, n];
    if (n.children) {
      const i = e.slice(1);
      if (i.length === 0 || (o = te(i, n.children, o), !o)) continue;
    }
    return o;
  }
}
function Ot(e) {
  const t = getRequestEvent(), r = t.nonce;
  let s = [];
  return Promise.resolve().then(async () => {
    let n = [];
    if (t.router && t.router.matches) {
      const o = [...t.router.matches];
      for (; o.length && (!o[0].info || !o[0].info.filesystem); ) o.shift();
      const i = o.length && te(o, t.routes);
      if (i) {
        const a = globalThis.MANIFEST.client.inputs;
        for (let l = 0; l < i.length; l++) {
          const c = i[l], f = a[c.$component.src];
          n.push(f.assets());
        }
      }
    }
    s = await Promise.all(n).then((o) => [...new Map(o.flat().map((i) => [i.attrs.key, i])).values()].filter((i) => i.attrs.rel === "modulepreload" && !t.assets.find((a) => a.attrs.key === i.attrs.key)));
  }), useAssets(() => s.length ? s.map((n) => T$1(n)) : void 0), createComponent$1(NoHydration, { get children() {
    return [It, createComponent$1(Tt, { get children() {
      return createComponent$1(e.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), t.assets.map((n) => T$1(n, r))];
      }, get scripts() {
        return r ? [ssr(z, ssrHydrationKey() + ssrAttribute("nonce", escape(r, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(_t, ssrHydrationKey(), ssrAttribute("nonce", escape(r, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(z, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(Nt, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(Lt, { get children() {
            return createComponent$1(xt, {});
          } });
        } });
      } });
    } })];
  } });
}
var Dt = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Benchmark Shop \u2014 SolidStart</title>', "</head>"], Ut = ["<html", ' lang="en">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const zt = Rt(() => createComponent$1(Ot, { document: ({ assets: e, children: t, scripts: r }) => ssr(Ut, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(Dt, escape(e));
} }), escape(t), escape(r)) }));

const handlers = [
  { route: '', handler: _CTCgq4, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: zo, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: zt, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$5(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $e$4 as $, De$2 as D, Ee$4 as E, F$4 as F, Ie$4 as I, Ke$5 as K, M$4 as M, Ne$2 as N, Oe$4 as O, Pe$4 as P, Qe$3 as Q, So as S, Te$4 as T, Ue$2 as U, Ve$2 as V, We$3 as W, Ye$1 as Y, V$2 as a, Qe$1 as b, Ue as c, We$1 as d, $e$1 as e, De as f, F$1 as g, nodeServer as n, qe$5 as q, te$2 as t, ye$4 as y, ze$5 as z };
//# sourceMappingURL=nitro.mjs.map
