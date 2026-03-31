import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import type { Product, ApiResponse } from "@benchmark/data";

const API_URL = process.env["API_URL"] ?? "http://localhost:3000";

export const getServerSideProps = (async (context) => {
  const { id } = context.params as { id: string };
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) return { notFound: true };
    const json = (await res.json()) as ApiResponse<Product>;
    return { props: { product: json.data } };
  } catch {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{ product: Product }>;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProductDetailPage({ product }: Props) {
  return (
    <Layout>
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-neutral-100 rounded-[var(--radius-card)] overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-brand-600 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-warning text-lg">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span className="text-sm text-neutral-500">
              {product.rating.toFixed(1)} rating
            </span>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-[var(--radius-badge)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl font-bold text-neutral-900">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-[var(--radius-badge)] ${
                  product.stock > 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <Link
              href="/cart"
              className="block w-full text-center font-medium bg-brand-600 text-white px-6 py-3 rounded-[var(--radius-button)] hover:bg-brand-700 transition-colors"
            >
              Add to Cart
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
