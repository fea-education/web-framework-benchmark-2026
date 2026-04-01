import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import type { Product } from "@benchmark/data";
import { products } from "@benchmark/data";

export const getStaticProps = (() => {
  return { props: { products } };
}) satisfies GetStaticProps<{ products: Product[] }>;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function ProductListingPage({ products }: Props) {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">All Products</h1>
        <span className="text-sm text-neutral-500">
          Showing {products.length} products
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow overflow-hidden flex flex-col"
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="aspect-square bg-neutral-100 overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">
                {product.category}
              </span>
              <h2 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-2 flex-1">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </h2>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-warning text-sm">
                  {"★".repeat(Math.round(product.rating))}
                  {"☆".repeat(5 - Math.round(product.rating))}
                </span>
                <span className="text-xs text-neutral-500">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
                <span className="text-lg font-bold text-neutral-900">
                  ${product.price.toFixed(2)}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-xs font-medium bg-brand-600 text-white px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-brand-700 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
