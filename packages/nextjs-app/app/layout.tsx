import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benchmark Shop — Next.js App Router",
  description: "Web Framework Benchmark 2026 — Next.js App Router implementation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
        <header className="bg-surface border-b border-neutral-200 shadow-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <a href="/" className="text-xl font-bold text-brand-600">
                BenchmarkShop
              </a>
              <nav className="flex gap-6">
                <a
                  href="/"
                  className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"
                >
                  Products
                </a>
                <a
                  href="/filter"
                  className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"
                >
                  Filter
                </a>
                <a
                  href="/cart"
                  className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"
                >
                  Cart
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-neutral-200 mt-16 py-8 text-center text-sm text-neutral-500">
          Web Framework Benchmark 2026 — Next.js App Router
        </footer>
      </body>
    </html>
  );
}
