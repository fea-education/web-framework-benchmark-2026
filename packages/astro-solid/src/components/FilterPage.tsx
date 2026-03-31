import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Product, Category } from '@benchmark/data';

interface FilterPageProps {
  initialProducts: Product[];
}

const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Food & Beverage',
  'Beauty',
];

export default function FilterPage(props: FilterPageProps) {
  const [products] = createSignal<Product[]>(props.initialProducts);
  const [selectedCategory, setSelectedCategory] = createSignal<Category | 'all'>('all');
  const [minPrice, setMinPrice] = createSignal<number>(0);
  const [maxPrice, setMaxPrice] = createSignal<number>(10000);
  const [minRating, setMinRating] = createSignal<number>(0);
  const [searchQuery, setSearchQuery] = createSignal<string>('');

  const maxProductPrice = createMemo(() =>
    Math.ceil(Math.max(...products().map((p) => p.price)))
  );

  const filteredProducts = createMemo(() => {
    const query = searchQuery().toLowerCase();
    const cat = selectedCategory();
    const minP = minPrice();
    const maxP = maxPrice();
    const minR = minRating();

    return products().filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (p.price < minP || p.price > maxP) return false;
      if (p.rating < minR) return false;
      if (query && !p.name.toLowerCase().includes(query) && !p.description.toLowerCase().includes(query)) return false;
      return true;
    });
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setMinPrice(0);
    setMaxPrice(maxProductPrice());
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div class="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside class="lg:w-64 flex-shrink-0">
        <div class="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-neutral-900">Filters</h2>
            <button
              onClick={resetFilters}
              class="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Search */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-neutral-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder="Search products..."
              class="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-neutral-700 mb-2">Category</label>
            <select
              value={selectedCategory()}
              onChange={(e) => setSelectedCategory(e.currentTarget.value as Category | 'all')}
              class="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All categories</option>
              <For each={CATEGORIES}>
                {(cat) => <option value={cat}>{cat}</option>}
              </For>
            </select>
          </div>

          {/* Price Range */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Price Range: ${minPrice()} – ${maxPrice()}
            </label>
            <div class="space-y-2">
              <div>
                <label class="text-xs text-neutral-500">Min price: ${minPrice()}</label>
                <input
                  type="range"
                  min={0}
                  max={maxProductPrice()}
                  value={minPrice()}
                  onInput={(e) => setMinPrice(Number(e.currentTarget.value))}
                  class="w-full accent-brand-600"
                />
              </div>
              <div>
                <label class="text-xs text-neutral-500">Max price: ${maxPrice()}</label>
                <input
                  type="range"
                  min={0}
                  max={maxProductPrice()}
                  value={maxPrice()}
                  onInput={(e) => setMaxPrice(Number(e.currentTarget.value))}
                  class="w-full accent-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Min Rating */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Min Rating: {minRating().toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={minRating()}
              onInput={(e) => setMinRating(Number(e.currentTarget.value))}
              class="w-full accent-brand-600"
            />
            <div class="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div class="flex-1">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-neutral-500">
            Showing <span class="font-medium text-neutral-900">{filteredProducts().length}</span> of{' '}
            <span class="font-medium text-neutral-900">{products().length}</span> products
          </p>
        </div>

        <Show
          when={filteredProducts().length > 0}
          fallback={
            <div class="text-center py-16">
              <p class="text-neutral-500 text-lg">No products match your filters</p>
              <button
                onClick={resetFilters}
                class="mt-4 text-brand-600 hover:text-brand-700 font-medium"
              >
                Reset filters
              </button>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <For each={filteredProducts()}>
              {(product) => (
                <a
                  href={`/products/${product.id}`}
                  class="group block bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div class="aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={400}
                      height={300}
                      loading="lazy"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div class="p-4">
                    <span class="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <h3 class="mt-2 text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {product.name}
                    </h3>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-lg font-bold text-neutral-900">${product.price.toFixed(2)}</span>
                      <div class="flex items-center gap-1">
                        <span class="text-yellow-400 text-sm">★</span>
                        <span class="text-xs text-neutral-500">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
