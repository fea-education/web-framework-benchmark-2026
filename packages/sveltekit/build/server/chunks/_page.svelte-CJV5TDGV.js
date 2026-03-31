import { ac as head, ae as attr, c as escape_html, ad as ensure_array_like, _ as derived } from './index-yQgrRH6H.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let product = derived(() => data.product);
    head("9lltit", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(product().name)} — Benchmark Shop</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 py-8"><a href="/" class="text-blue-600 hover:underline mb-6 inline-block">← Back to Products</a> <div class="bg-white rounded-xl shadow-sm overflow-hidden"><div class="md:flex"><div class="md:w-1/2"><img${attr("src", product().image_url)}${attr("alt", product().name)} width="400" height="300" class="w-full h-64 md:h-full object-cover"/></div> <div class="md:w-1/2 p-6"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">${escape_html(product().category)}</span> <h1 class="mt-3 text-2xl font-bold text-gray-900">${escape_html(product().name)}</h1> <p class="mt-3 text-gray-600">${escape_html(product().description)}</p> <div class="mt-4 flex items-center gap-3"><span class="text-3xl font-bold text-gray-900">$${escape_html(product().price.toFixed(2))}</span> <span class="text-sm text-gray-500">★ ${escape_html(product().rating.toFixed(1))}</span></div> <div class="mt-2 text-sm text-gray-500">${escape_html(product().stock)} in stock</div> `);
    if (product().tags.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4 flex flex-wrap gap-2"><!--[-->`);
      const each_array = ensure_array_like(product().tags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <a href="/cart" class="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-lg transition-colors">Add to Cart</a></div></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CJV5TDGV.js.map
