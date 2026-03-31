import Link from "next/link";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  cartCount?: number;
}

export default function Layout({ children, cartCount = 0 }: LayoutProps) {
  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans min-h-screen">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-700">
            ShopBench
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm font-medium text-neutral-600">
            <Link href="/" className="hover:text-neutral-900">
              Products
            </Link>
            <Link href="/filter" className="hover:text-neutral-900">
              Filter
            </Link>
            <Link href="/cart" className="hover:text-neutral-900">
              Cart ({cartCount})
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
