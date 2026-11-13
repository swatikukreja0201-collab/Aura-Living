import { ArrowRight, Check, MessageSquare, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AtelierMonographModal } from './components/AtelierMonographModal';
import { BagDrawer } from './components/BagDrawer';
import { ConciergeDrawer } from './components/ConciergeDrawer';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ResilientImage } from './components/ResilientImage';
import {
  EDITORIAL_MEDIA,
  FREE_SHIPPING_THRESHOLD,
  PRODUCTS,
  STANDARD_SHIPPING_FEE,
} from './data/catalog';
import {
  BagItem,
  CategoryFilter,
  ConfirmedOrder,
  ProductItem,
  ShippingDetails,
  SortOrder,
} from './types';

const BAG_STORAGE_KEY = 'aura_living_bag_v1';
const ORDER_STORAGE_KEY = 'aura_living_order_v1';

const CATEGORY_TABS: CategoryFilter[] = [
  'All',
  'Ceramics',
  'Lighting',
  'Textiles',
  'Furniture',
];

function readStoredBag(): BagItem[] {
  try {
    const raw = window.localStorage.getItem(BAG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is BagItem =>
        typeof entry?.productId === 'string' &&
        typeof entry?.finishName === 'string' &&
        typeof entry?.quantity === 'number' &&
        entry.quantity > 0
    );
  } catch {
    return [];
  }
}

function readStoredOrder(): ConfirmedOrder | null {
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.orderNumber !== 'string') return null;
    return parsed as ConfirmedOrder;
  } catch {
    return null;
  }
}

export default function App() {
  const [bagItems, setBagItems] = useState<BagItem[]>(() => readStoredBag());
  const [latestOrder, setLatestOrder] = useState<ConfirmedOrder | null>(() =>
    readStoredOrder()
  );
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isMonographOpen, setIsMonographOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'subscribed'>('idle');

  const collectionRef = useRef<HTMLElement | null>(null);
  const atelierRef = useRef<HTMLElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore storage quota errors in restricted browsing contexts
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      if (latestOrder) {
        window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(latestOrder));
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [latestOrder]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const bagCount = useMemo(
    () => bagItems.reduce((total, item) => total + item.quantity, 0),
    [bagItems]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matched = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        product.title.toLowerCase().includes(query) ||
        product.materials.toLowerCase().includes(query) ||
        product.shortNote.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.origin.toLowerCase().includes(query)
      );
    });

    if (sortOrder === 'price-asc') {
      return [...matched].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...matched].sort((a, b) => b.price - a.price);
    }
    return matched;
  }, [activeCategory, searchQuery, sortOrder]);

  const scrollToCollection = (category?: CategoryFilter) => {
    if (category) {
      setActiveCategory(category);
    }
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToAtelier = () => {
    atelierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToBag = (
    product: ProductItem,
    finishName: string,
    quantity: number
  ) => {
    const resolvedFinish = finishName || product.finishes[0]?.name || 'Standard';
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id && item.finishName === resolvedFinish
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        { productId: product.id, finishName: resolvedFinish, quantity },
      ];
    });
    showToast(`${product.title} (${resolvedFinish}) added to bag`);
  };

  const handleQuickAdd = (product: ProductItem) => {
    const defaultFinish = product.finishes[0]?.name ?? 'Standard';
    handleAddToBag(product, defaultFinish, 1);
  };

  const handleUpdateBagQuantity = (
    productId: string,
    finishName: string,
    delta: number
  ) => {
    setBagItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.finishName === finishName) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveBagItem = (productId: string, finishName: string) => {
    setBagItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.finishName === finishName)
      )
    );
  };

  const handlePlaceOrder = (shipping: ShippingDetails): ConfirmedOrder => {
    const resolvedLineItems = bagItems
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          title: product.title,
          sku: product.sku,
          finishName: item.finishName,
          unitPrice: product.price,
          quantity: item.quantity,
          image: product.image,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const subtotal = resolvedLineItems.reduce(
      (sum, entry) => sum + entry.unitPrice * entry.quantity,
      0
    );
    const shippingCost =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const orderNum = `#AL-${Math.floor(1000 + Math.random() * 9000)}`;

    const confirmed: ConfirmedOrder = {
      orderNumber: orderNum,
      placedAt: new Date().toISOString(),
      items: resolvedLineItems,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      shipping,
    };

    setLatestOrder(confirmed);
    setBagItems([]);
    return confirmed;
  };

  const handleNewsletterSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('subscribed');
    setNewsletterEmail('');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#fcf9f2] text-[#1c1c18]">
      <Header
        bagCount={bagCount}
        onOpenBag={() => setIsBagOpen(true)}
        onNavigateCategory={(cat) => scrollToCollection(cat)}
        onNavigateAtelier={scrollToAtelier}
        onOpenMonograph={() => setIsMonographOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1: Architectural Split Editorial Hero */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-16 pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-6">
              <div>
                <p className="label-caps text-[#8d4e34]">
                  Autumn Archive · Copenhagen & Kyoto
                </p>
                <h1 className="mt-4 font-serif text-[34px] sm:text-[42px] xl:text-[48px] leading-[1.15] tracking-[-0.02em] text-[#1c1c18] text-balance">
                  Quiet Objects for Intentional Living
                </h1>
                <p className="mt-5 text-[16px] md:text-[17px] leading-[28px] text-[#4a4640] max-w-[46ch]">
                  Architectural homeware shaped from unglazed stoneware, Spanish alabaster, European white oak, and undyed Belgian flax. Designed to bring stillness and tactile permanence to daily rituals.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => scrollToCollection('All')}
                    className="h-12 px-6 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors duration-180 inline-flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMonographOpen(true)}
                    className="hairline-link text-[14px] font-medium text-[#1c1c18] cursor-pointer whitespace-nowrap"
                  >
                    <span>Read Atelier Monograph</span>
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[rgba(28,27,26,0.1)] grid grid-cols-2 gap-6">
                <div>
                  <span className="label-caps text-[#7b766f] block">Complimentary Courier</span>
                  <span className="mt-1 block text-[14px] font-medium text-[#1c1c18] tabular-nums">
                    Orders above $600
                  </span>
                </div>
                <div>
                  <span className="label-caps text-[#7b766f] block">Current Edition</span>
                  <span className="mt-1 block text-[14px] font-medium text-[#1c1c18] tabular-nums">
                    9 Numbered Objects
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-full min-h-[340px] sm:min-h-[440px] lg:min-h-[540px] rounded-[4px] overflow-hidden bg-[#ebe8e1] border border-[rgba(28,27,26,0.08)]">
                <ResilientImage
                  src={EDITORIAL_MEDIA.hero.src}
                  alt={EDITORIAL_MEDIA.hero.alt}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-column studio provenance strip directly below hero split */}
          <div className="mt-10 pt-8 border-t border-[rgba(28,27,26,0.08)] grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="label-caps text-[#7b766f]">01 · Ceramics</p>
              <p className="mt-1.5 text-[14px] text-[#1c1c18]">
                Bornholm & Shigaraki stoneware
              </p>
            </div>
            <div>
              <p className="label-caps text-[#7b766f]">02 · Lighting</p>
              <p className="mt-1.5 text-[14px] text-[#1c1c18]">
                Honed Aragon alabaster & brass
              </p>
            </div>
            <div>
              <p className="label-caps text-[#7b766f]">03 · Textiles</p>
              <p className="mt-1.5 text-[14px] text-[#1c1c18]">
                Undyed Belgian flax & alpaca
              </p>
            </div>
            <div>
              <p className="label-caps text-[#7b766f]">04 · Furniture</p>
              <p className="mt-1.5 text-[14px] text-[#1c1c18]">
                Soap-finished white oak & travertine
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Curated Collection Grid */}
        <section
          id="collection"
          ref={collectionRef}
          className="border-t border-[rgba(28,27,26,0.08)] bg-[#fcf9f2] py-16 md:py-24 scroll-mt-16"
        >
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="label-caps text-[#7b766f]">Curated Index</p>
                <h2 className="mt-2 font-serif text-[28px] sm:text-[36px] leading-[1.2] tracking-[-0.015em] text-[#1c1c18]">
                  Architectural Living Objects
                </h2>
              </div>

              <p className="text-[14px] text-[#4a4640] tabular-nums">
                Showing {filteredProducts.length} of {PRODUCTS.length} objects
              </p>
            </div>

            {/* Filter, Search, and Sort Toolbar */}
            <div className="mt-8 pb-8 border-b border-[rgba(28,27,26,0.08)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter objects by category"
                className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
              >
                {CATEGORY_TABS.map((category) => {
                  const isActive = activeCategory === category;
                  const count =
                    category === 'All'
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(category)}
                      className={`h-10 px-4 rounded-[4px] border text-[12px] font-semibold tracking-[0.06em] uppercase transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#1C1B1A] text-[#fcf9f2] border-[#1C1B1A]'
                          : 'bg-[#FAF8F5] text-[#4a4640] border-[rgba(28,27,26,0.15)] hover:bg-[rgba(28,27,26,0.04)] hover:text-[#1c1c18]'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`tabular-nums text-[11px] ${
                          isActive ? 'text-[#fcf9f2]/75' : 'text-[#7b766f]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="w-4 h-4 text-[#7b766f] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search material, origin, object..."
                    aria-label="Search collection"
                    className="w-full h-[46px] pl-10 pr-9 rounded-[4px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18] placeholder:text-[#7b766f]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 inline-flex items-center justify-center text-[#7b766f] hover:text-[#1c1c18] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <label className="sr-only" htmlFor="sort-select">
                  Sort objects
                </label>
                <select
                  id="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="h-[46px] px-3.5 rounded-[4px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[13px] font-medium text-[#1c1c18] cursor-pointer"
                >
                  <option value="featured">Sort: Curated Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsConciergeOpen(true)}
                  className="h-[46px] px-4 rounded-[4px] border border-[rgba(28,27,26,0.28)] bg-transparent text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors duration-150 inline-flex items-center justify-center gap-2 text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ask Concierge</span>
                </button>
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="mt-12 p-12 rounded-[8px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.08)] text-center max-w-lg mx-auto">
                <p className="label-caps text-[#7b766f]">No Matching Objects</p>
                <h3 className="mt-2 font-serif text-[22px] text-[#1c1c18]">
                  Nothing matches "{searchQuery}"
                </h3>
                <p className="mt-2 text-[14px] text-[#4a4640]">
                  Try searching for stoneware, alabaster, linen, oak, or reset your active category filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-6 h-11 px-6 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(item) => setSelectedProduct(item)}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Split Editorial Craftsmanship & Atelier Story */}
        <section
          id="atelier"
          ref={atelierRef}
          className="border-t border-[rgba(28,27,26,0.08)] py-16 md:py-24 scroll-mt-16"
        >
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[8px] overflow-hidden border border-[rgba(28,27,26,0.08)] bg-[#FAF8F5] items-stretch">
              <div className="lg:col-span-6 bg-[#ebe8e1] min-h-[320px] lg:min-h-[500px]">
                <ResilientImage
                  src={EDITORIAL_MEDIA.atelier.src}
                  alt={EDITORIAL_MEDIA.atelier.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 p-8 sm:p-12 xl:p-16 flex flex-col justify-between gap-8">
                <div>
                  <p className="label-caps text-[#8d4e34]">Material Provenance</p>
                  <h2 className="mt-3 font-serif text-[28px] sm:text-[36px] leading-[1.22] tracking-[-0.015em] text-[#1c1c18] text-balance">
                    Unbleached Fiber & Raw Mineral Pigments
                  </h2>
                  <p className="mt-5 text-[15px] sm:text-[16px] leading-[26px] text-[#4a4640]">
                    Every AURA Living piece is produced in small seasonal runs alongside independent European and Japanese workshops. We leave surfaces honest—soaped oak timber, unsealed Roman travertine, and raw flax woven without optical bleaches.
                  </p>
                  <p className="mt-4 text-[15px] sm:text-[16px] leading-[26px] text-[#4a4640]">
                    Rather than chasing seasonal novelty, our archive evolves incrementally through material studies documented in our studio monographs.
                  </p>
                </div>

                <div className="pt-6 border-t border-[rgba(28,27,26,0.08)] flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setIsMonographOpen(true)}
                    className="hairline-link text-[14px] font-medium text-[#1c1c18] cursor-pointer"
                  >
                    <span>Open Atelier Monograph</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="label-caps text-[#7b766f]">Issue 04 · Material Study</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Section 4: Quiet Architectural Footer */}
      <footer className="border-t border-[rgba(28,27,26,0.08)] bg-[#f1eee7] py-14 md:py-16">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[rgba(28,27,26,0.08)]">
            <div className="md:col-span-5 space-y-3">
              <span className="font-serif text-[22px] text-[#1c1c18] block">
                AURA Living
              </span>
              <p className="text-[14px] leading-[22px] text-[#4a4640] max-w-sm">
                Curated architectural homeware, ceramics, alabaster lighting, and sculptural timber furniture crafted for quiet rooms.
              </p>
              <p className="label-caps text-[#7b766f] pt-2">
                Copenhagen · Kyoto · Zurich
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h3 className="label-caps text-[#7b766f]">Collection</h3>
              <ul className="space-y-2 text-[14px] text-[#1c1c18]">
                {(['Ceramics', 'Lighting', 'Textiles', 'Furniture'] as const).map(
                  (cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => scrollToCollection(cat)}
                        className="hover:text-[#8d4e34] transition-colors cursor-pointer"
                      >
                        {cat}
                      </button>
                    </li>
                  )
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => setIsMonographOpen(true)}
                    className="hover:text-[#8d4e34] transition-colors cursor-pointer"
                  >
                    Atelier Monograph
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h3 className="label-caps text-[#7b766f]">Seasonal Dispatch</h3>
              <p className="text-[13px] leading-[20px] text-[#4a4640]">
                Receive quiet notes when new kiln firings and numbered furniture editions open.
              </p>

              {newsletterStatus === 'subscribed' ? (
                <div className="h-[46px] px-4 rounded-[4px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.12)] inline-flex items-center gap-2 text-[13px] text-[#1c1c18]">
                  <Check className="w-4 h-4 text-[#8d4e34]" />
                  <span>Subscribed to the Atelier Dispatch.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex items-stretch gap-2"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for seasonal dispatch
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 min-w-0 h-[46px] px-3.5 rounded-[4px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18] placeholder:text-[#7b766f]"
                  />
                  <button
                    type="submit"
                    className="h-[46px] px-5 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#7b766f]">
            <span>© {new Date().getFullYear()} AURA Living Studio. All rights reserved.</span>
            <span>All prices in USD · Insured Worldwide Courier</span>
          </div>
        </div>
      </footer>

      {/* Interactive Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
      />

      <BagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        products={PRODUCTS}
        latestOrder={latestOrder}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateBagQuantity}
        onRemoveItem={handleRemoveBagItem}
        onPlaceOrder={handlePlaceOrder}
        onBrowseCollection={() => scrollToCollection('All')}
      />

      <AtelierMonographModal
        isOpen={isMonographOpen}
        onClose={() => setIsMonographOpen(false)}
        onExploreCategory={(cat) => scrollToCollection(cat)}
      />

      <ConciergeDrawer
        isOpen={isConciergeOpen}
        products={PRODUCTS}
        activeCategory={activeCategory}
        onClose={() => setIsConciergeOpen(false)}
        onInspectProduct={(item) => setSelectedProduct(item)}
        onQuickAddProduct={handleQuickAdd}
        onApplyCategoryFilter={(cat) => scrollToCollection(cat)}
      />

      {/* Discreet Floating Concierge Trigger */}
      {!isConciergeOpen && !isBagOpen && !selectedProduct && !isMonographOpen && (
        <button
          type="button"
          onClick={() => setIsConciergeOpen(true)}
          aria-label="Open AURA Studio Concierge"
          className="fixed bottom-5 right-5 z-30 h-11 px-4 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#8d4e34] transition-colors duration-180 contact-shadow inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap border border-[rgba(255,255,255,0.12)]"
        >
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Studio Concierge</span>
        </button>
      )}

      {/* Quiet Add-to-Bag Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-40 max-w-sm bg-[#1C1B1A] text-[#fcf9f2] px-4 py-3 rounded-[4px] contact-shadow flex items-center justify-between gap-4 border border-[rgba(255,255,255,0.12)]"
        >
          <span className="text-[13px] leading-[18px]">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsBagOpen(true);
            }}
            className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#D4AF87] hover:text-[#fcf9f2] whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
