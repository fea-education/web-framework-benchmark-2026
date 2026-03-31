import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { ApiResponse, Product } from "@benchmark/data";
import { Suspense } from "react";

const API_URL = process.env["API_URL"] ?? "http://localhost:3000";

// SSR — per-request fetch (no caching)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  const json = (await res.json()) as ApiResponse<Product>;
  return json.data;
}

async function ProductDetail({ id }: { id: string }) {
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-neutral-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4">
        <div>
          <span className="inline-block rounded-[var(--radius-badge)] bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-neutral-900">
            {product.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(product.rating)
                    ? "text-warning"
                    : "text-neutral-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-neutral-600">
            {product.rating.toFixed(1)} / 5.0
          </span>
        </div>

        <p className="text-4xl font-bold text-neutral-900">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-base text-neutral-600 leading-relaxed">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-badge)] bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              product.stock > 0 ? "bg-success" : "bg-danger"
            }`}
          />
          <span className="text-sm font-medium text-neutral-700">
            {product.stock > 0
              ? `${product.stock} units in stock`
              : "Out of stock"}
          </span>
        </div>

        <Link
          href="/cart"
          className="mt-2 inline-flex items-center justify-center rounded-[var(--radius-button)] bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Add to Cart
        </Link>

        <Link
          href="/"
          className="text-sm text-brand-600 hover:text-brand-700 transition-colors"
        >
          &larr; Back to all products
        </Link>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      }
    >
      <ProductDetail id={id} />
    </Suspense>
  );
}
