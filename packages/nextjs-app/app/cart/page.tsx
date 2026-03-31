"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem, Product } from "@benchmark/data";

// Sample products for demonstration — in a real app this would be shared state
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sample Product",
    description: "A great product",
    price: 29.99,
    category: "Electronics",
    stock: 10,
    rating: 4.5,
    image_url: "https://picsum.photos/seed/1/400/400",
    tags: ["sample"],
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addProductId, setAddProductId] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function addItem(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeItem(productId: number) {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  async function handleAddById() {
    const id = parseInt(addProductId, 10);
    if (isNaN(id) || id <= 0) return;

    const apiUrl =
      typeof window !== "undefined"
        ? (process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3000")
        : "http://localhost:3000";

    try {
      const res = await fetch(`${apiUrl}/products/${id}`);
      if (!res.ok) {
        alert("Product not found");
        return;
      }
      const json = (await res.json()) as { data: Product };
      addItem(json.data);
      setAddProductId("");
    } catch {
      alert("Failed to fetch product");
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-[var(--radius-card)] border border-neutral-200 bg-surface gap-4">
              <svg
                className="h-12 w-12 text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <p className="text-sm text-neutral-500">Your cart is empty</p>
              <Link
                href="/"
                className="inline-flex items-center rounded-[var(--radius-button)] bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 rounded-[var(--radius-card)] border border-neutral-200 bg-surface p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-sm font-semibold text-neutral-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {item.product.category}
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="mt-1 text-xs text-danger hover:text-danger/80 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add by ID (demo) */}
          <div className="mt-6 rounded-[var(--radius-card)] border border-neutral-200 bg-surface p-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Add product by ID (demo)
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={addProductId}
                onChange={(e) => setAddProductId(e.target.value)}
                placeholder="Product ID (1–100)"
                className="flex-1 rounded-[var(--radius-button)] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => void handleAddById()}
                className="rounded-[var(--radius-button)] bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SAMPLE_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addItem(p)}
                  className="rounded-[var(--radius-badge)] bg-neutral-100 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-surface p-5 shadow-[var(--shadow-card)]">
            <h2 className="text-base font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 border-b border-neutral-200 pb-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600 line-clamp-1 mr-4">
                    {item.product.name}{" "}
                    <span className="text-neutral-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-neutral-900 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-sm text-neutral-400">No items</p>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-neutral-900 mb-6">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              disabled={cartItems.length === 0}
              className="w-full rounded-[var(--radius-button)] bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Checkout
            </button>

            <p className="mt-3 text-center text-xs text-neutral-400">
              Checkout is out of scope for this benchmark
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
