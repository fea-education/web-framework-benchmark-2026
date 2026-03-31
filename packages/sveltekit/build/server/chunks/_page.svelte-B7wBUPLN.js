import { ac as head, ad as ensure_array_like, ae as attr, af as stringify, c as escape_html } from './index-yQgrRH6H.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Products — Benchmark Shop</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 py-8"><h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
    const each_array = ensure_array_like(data.products);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let product = each_array[$$index];
      $$renderer2.push(`<a${attr("href", `/products/${stringify(product.id)}`)} class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"><img${attr("src", product.image_url)}${attr("alt", product.name)} width="400" height="300" class="w-full h-48 object-cover" loading="lazy"/> <div class="p-4"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">${escape_html(product.category)}</span> <h2 class="mt-2 text-base font-semibold text-gray-900 line-clamp-2">${escape_html(product.name)}</h2> <div class="mt-2 flex items-center justify-between"><span class="text-lg font-bold text-gray-900">$${escape_html(product.price.toFixed(2))}</span> <span class="text-sm text-gray-500">★ ${escape_html(product.rating.toFixed(1))}</span></div></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B7wBUPLN.js.map
