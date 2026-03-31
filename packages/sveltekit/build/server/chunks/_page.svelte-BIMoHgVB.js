import { ac as head, ag as store_get, ad as ensure_array_like, c as escape_html, ae as attr, af as stringify, ah as unsubscribe_stores } from './index-yQgrRH6H.js';
import { d as derived, w as writable } from './index2-fygOGeLv.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const allProducts = writable([]);
    const loading = writable(true);
    const error = writable(null);
    const selectedCategory = writable("");
    const minPrice = writable(0);
    const maxPrice = writable(1e3);
    const minRating = writable(0);
    const filteredProducts = derived([allProducts, selectedCategory, minPrice, maxPrice, minRating], ([$all, $cat, $min, $max, $rating]) => {
      return $all.filter((p) => {
        if ($cat && p.category !== $cat) return false;
        if (p.price < $min || p.price > $max) return false;
        if (p.rating < $rating) return false;
        return true;
      });
    });
    const categories = [
      "Electronics",
      "Clothing",
      "Books",
      "Home & Garden",
      "Sports",
      "Toys",
      "Food & Beverage",
      "Beauty"
    ];
    head("1hednvv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Filter Products — Benchmark Shop</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 py-8"><h1 class="text-3xl font-bold text-gray-900 mb-8">Filter Products</h1> <div class="flex flex-col md:flex-row gap-8"><aside class="md:w-64 shrink-0"><div class="bg-white rounded-xl shadow-sm p-5 space-y-6"><div><label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category</label> `);
    $$renderer2.select(
      {
        id: "category",
        value: store_get($$store_subs ??= {}, "$selectedCategory", selectedCategory),
        class: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All Categories`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(categories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer3.option({ value: cat }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cat)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label class="block text-sm font-semibold text-gray-700 mb-2">Min Price: $${escape_html(store_get($$store_subs ??= {}, "$minPrice", minPrice))}</label> <input type="range" min="0" max="1000" step="10"${attr("value", store_get($$store_subs ??= {}, "$minPrice", minPrice))} class="w-full accent-blue-600"/></div> <div><label class="block text-sm font-semibold text-gray-700 mb-2">Max Price: $${escape_html(store_get($$store_subs ??= {}, "$maxPrice", maxPrice))}</label> <input type="range" min="0" max="1000" step="10"${attr("value", store_get($$store_subs ??= {}, "$maxPrice", maxPrice))} class="w-full accent-blue-600"/></div> <div><label class="block text-sm font-semibold text-gray-700 mb-2">Min Rating: ${escape_html(store_get($$store_subs ??= {}, "$minRating", minRating).toFixed(1))}★</label> <input type="range" min="0" max="5" step="0.1"${attr("value", store_get($$store_subs ??= {}, "$minRating", minRating))} class="w-full accent-blue-600"/></div> <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm">Reset Filters</button></div></aside> <div class="flex-1">`);
    if (store_get($$store_subs ??= {}, "$loading", loading)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><span class="text-gray-500">Loading products…</span></div>`);
    } else if (store_get($$store_subs ??= {}, "$error", error)) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="text-red-600 text-center py-12">${escape_html(store_get($$store_subs ??= {}, "$error", error))}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-sm text-gray-500 mb-4">${escape_html(store_get($$store_subs ??= {}, "$filteredProducts", filteredProducts).length)} products found</p> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"><!--[-->`);
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$filteredProducts", filteredProducts));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", `/products/${stringify(product.id)}`)} class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"><img${attr("src", product.image_url)}${attr("alt", product.name)} width="400" height="300" class="w-full h-44 object-cover" loading="lazy"/> <div class="p-4"><span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">${escape_html(product.category)}</span> <h2 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">${escape_html(product.name)}</h2> <div class="mt-2 flex items-center justify-between"><span class="text-base font-bold text-gray-900">$${escape_html(product.price.toFixed(2))}</span> <span class="text-sm text-gray-500">★ ${escape_html(product.rating.toFixed(1))}</span></div></div></a>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$filteredProducts", filteredProducts).length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="text-center py-16 text-gray-400">No products match your filters.</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BIMoHgVB.js.map
