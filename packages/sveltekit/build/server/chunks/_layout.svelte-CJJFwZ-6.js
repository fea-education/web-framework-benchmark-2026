function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<nav class="bg-white border-b border-gray-200 px-4 py-3"><div class="max-w-7xl mx-auto flex items-center justify-between"><a href="/" class="text-xl font-bold text-blue-600">Benchmark Shop</a> <div class="flex gap-6"><a href="/" class="text-gray-600 hover:text-blue-600">Products</a> <a href="/filter" class="text-gray-600 hover:text-blue-600">Filter</a> <a href="/cart" class="text-gray-600 hover:text-blue-600">Cart</a></div></div></nav> <main class="min-h-screen bg-gray-50">`);
  children($$renderer);
  $$renderer.push(`<!----></main>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CJJFwZ-6.js.map
