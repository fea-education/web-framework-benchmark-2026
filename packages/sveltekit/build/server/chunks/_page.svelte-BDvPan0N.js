import { ac as head, ag as store_get, ad as ensure_array_like, ae as attr, c as escape_html, ah as unsubscribe_stores } from './index-yQgrRH6H.js';
import { d as derived, w as writable } from './index2-fygOGeLv.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const cartItems = writable([]);
    const cartTotal = derived(cartItems, ($items) => $items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    const cartCount = derived(cartItems, ($items) => $items.reduce((sum, item) => sum + item.quantity, 0));
    const products = writable([]);
    const loading = writable(true);
    head("k7hhd7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cart — Benchmark Shop</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 py-8"><h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1> <div class="flex flex-col lg:flex-row gap-8"><div class="flex-1">`);
    if (store_get($$store_subs ??= {}, "$cartItems", cartItems).length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-xl shadow-sm p-12 text-center"><p class="text-gray-400 text-lg mb-4">Your cart is empty</p> <a href="/" class="text-blue-600 hover:underline">Browse products</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cartItems", cartItems));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"><img${attr("src", item.product.image_url)}${attr("alt", item.product.name)} width="80" height="80" class="w-20 h-20 object-cover rounded-lg"/> <div class="flex-1"><h3 class="font-semibold text-gray-900">${escape_html(item.product.name)}</h3> <p class="text-sm text-gray-500">${escape_html(item.product.category)}</p> <p class="text-blue-600 font-bold">$${escape_html(item.product.price.toFixed(2))}</p></div> <div class="flex items-center gap-2"><button class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">-</button> <span class="w-8 text-center font-semibold">${escape_html(item.quantity)}</span> <button class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">+</button></div> <button class="text-red-500 hover:text-red-700 text-sm font-medium ml-2 transition-colors">Remove</button></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-10"><h2 class="text-xl font-bold text-gray-900 mb-4">Add Products</h2> `);
    if (store_get($$store_subs ??= {}, "$loading", loading)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-gray-400">Loading…</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"><!--[-->`);
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$products", products));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<button class="bg-white rounded-lg shadow-sm p-3 text-left hover:shadow-md transition-shadow"><img${attr("src", product.image_url)}${attr("alt", product.name)} width="200" height="150" class="w-full h-28 object-cover rounded-md mb-2" loading="lazy"/> <p class="text-xs font-medium text-gray-800 line-clamp-2">${escape_html(product.name)}</p> <p class="text-xs text-blue-600 font-semibold mt-1">$${escape_html(product.price.toFixed(2))}</p></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="lg:w-72"><div class="bg-white rounded-xl shadow-sm p-5 sticky top-4"><h2 class="text-lg font-bold text-gray-900 mb-4">Order Summary</h2> <div class="space-y-2 text-sm"><div class="flex justify-between text-gray-600"><span>Items (${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount))})</span> <span>$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span></div> <div class="flex justify-between text-gray-600"><span>Shipping</span> <span class="text-green-600">Free</span></div> <hr class="my-2"/> <div class="flex justify-between font-bold text-gray-900 text-base"><span>Total</span> <span>$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span></div></div> <button${attr("disabled", store_get($$store_subs ??= {}, "$cartItems", cartItems).length === 0, true)} class="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors">Checkout</button></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BDvPan0N.js.map
