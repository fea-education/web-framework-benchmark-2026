import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import type { Product, CartItem, ApiResponse } from "@benchmark/data";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addId, setAddId] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`/api/products`);
        const json = (await res.json()) as ApiResponse<Product[]>;
        setProducts(json.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
        .slice(0, 5)
    );
  }, [searchQuery, products]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSearchQuery("");
    setSearchResults([]);
    setAddId("");
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout cartCount={totalItems}>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">
        Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
      </h1>

      {/* Add product search */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">
          Add Product
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="w-full border border-neutral-300 rounded-[var(--radius-button)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {searchResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[var(--radius-card)] shadow-[var(--shadow-dropdown)] z-20">
              {searchResults.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center gap-3"
                  >
                    <span className="font-medium text-neutral-900 truncate">
                      {product.name}
                    </span>
                    <span className="text-neutral-500 shrink-0">
                      ${product.price.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-12 text-center">
          <p className="text-neutral-500 mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="inline-block text-sm font-medium bg-brand-600 text-white px-6 py-2 rounded-[var(--radius-button)] hover:bg-brand-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4 flex gap-4"
              >
                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.product.category}
                  </p>
                  <p className="text-sm font-bold text-neutral-900 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-danger text-xs hover:underline"
                  >
                    Remove
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded text-sm hover:bg-neutral-50"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded text-sm hover:bg-neutral-50"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-neutral-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600 truncate pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-neutral-900 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-base font-bold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="mt-5 w-full bg-brand-600 text-white font-medium py-3 rounded-[var(--radius-button)] hover:bg-brand-700 transition-colors"
                onClick={() => alert("Checkout is out of scope for this benchmark.")}
              >
                Checkout
              </button>

              <button
                onClick={() => setCart([])}
                className="mt-2 w-full text-sm text-neutral-500 hover:text-danger transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
