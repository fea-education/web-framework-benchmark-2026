import Image from "next/image";
import Link from "next/link";
import type { ApiResponse, Product } from "@benchmark/data";

const API_URL = process.env["API_URL"] ?? "http://localhost:3000";

// Static generation — fetches at build time; falls back to SSR on build failures
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: false },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiResponse<Product[]>;
    return json.data;
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">All Products</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {products.length} products available
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-[var(--radius-card)] border border-neutral-200 bg-surface">
          <p className="text-sm text-neutral-500">
            No products available. Ensure the API is running.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block rounded-[var(--radius-card)] border border-neutral-200 bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-neutral-100">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="inline-block rounded-[var(--radius-badge)] bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {product.category}
                </span>
                <h2 className="mt-2 text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-neutral-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <svg
                      className="h-3.5 w-3.5 text-warning"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
