"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string };
  description: string;
}

interface ProductVariant {
  sku?: string;
  finish: string;
  size: { value: number; unit: "mm" | "inch" | "cm" };
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  images: { url: string; publicId: string }[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  images: { url: string; publicId: string }[];
  specifications: {
    material: string;
    mechanism?: string;
    weightCapacity?: string;
    packagingUnit?: string;
    includedComponents?: string[];
  };
  variants: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const finishColorMap: Record<string, string> = {
  brass: "#b8860b",
  gold: "#c79a3c",
  "antique gold": "#a67c00",
  chrome: "#d9dde3",
  silver: "#c7cbd2",
  black: "#111111",
  "matt black": "#111111",
  bronze: "#8c4a12",
  copper: "#b87333",
  nickel: "#b8c0c8",
};

function getFinishMeta(finish?: string) {
  const normalized = (finish || "").toLowerCase();
  return {
    label: finish || "Finish",
    color: finishColorMap[normalized] || "#8b5cf6",
  };
}

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = desktopSliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = desktopSliderRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, categories]);

  const scrollDesktop = (dir: "left" | "right") => {
    const el = desktopSliderRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;
    el.scrollBy({ left: dir === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/product-categories`)
      .then((res) => { setCategories(res.data.data); setLoading(false); })
      .catch(() => { setError("Failed to load categories."); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background text-foreground text-center w-full">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="h-8 bg-foreground/10 w-48 rounded mb-10" />
          <div className="flex flex-row w-full h-80 px-2 gap-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-full flex-1 bg-foreground/10 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div className="py-16 text-center text-red-500">{error}</div>;

  return (
    <section className="w-full py-10 sm:py-16 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 select-none">

        {/* Mobile: horizontal slider */}
        <div className="sm:hidden relative">
          <button
            onClick={() => document.getElementById("cat-slider")?.scrollBy({ left: -200, behavior: "smooth" })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center -translate-x-1"
          >
            <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            id="cat-slider"
            className="flex gap-3 overflow-x-auto scroll-smooth px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <a
                key={category._id}
                href={`/category/${category.slug}`}
                className="relative flex-shrink-0 w-44 h-36 rounded-2xl overflow-hidden bg-neutral-900 block"
              >
                {category.image?.url && (
                  <Image src={category.image.url} alt={category.name} fill sizes="176px" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-bold leading-tight line-clamp-2">{category.name}</p>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={() => document.getElementById("cat-slider")?.scrollBy({ left: 200, behavior: "smooth" })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center translate-x-1"
          >
            <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop: slider with prev/next arrows */}
        <div className="hidden sm:block relative group/desktopslider">
          <button
            onClick={() => scrollDesktop("left")}
            aria-label="Previous"
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg
                        border border-zinc-200 flex items-center justify-center transition-all duration-200
                        ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={desktopSliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => {
              const isHovered = hoveredId === category._id;
              return (
                <a
                  key={category._id}
                  href={`/category/${category.slug}`}
                  onMouseEnter={() => setHoveredId(category._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative flex-shrink-0 snap-start w-[260px] h-80 rounded-2xl overflow-hidden bg-neutral-900 block"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={category.image?.url || "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=1074&auto=format&fit=crop"}
                      alt={category.name}
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index < 5}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-white pointer-events-none">
                    <p className="text-lg font-bold tracking-wide truncate">{category.name}</p>
                    <motion.p
                      className="text-xs text-neutral-200 font-light mt-1 line-clamp-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: isHovered ? 0.3 : 0.1, delay: isHovered ? 0.15 : 0 }}
                    >
                      {category.description || "Explore curated collections."}
                    </motion.p>
                  </div>
                </a>
              );
            })}
          </div>

          <button
            onClick={() => scrollDesktop("right")}
            aria-label="Next"
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg
                        border border-zinc-200 flex items-center justify-center transition-all duration-200
                        ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Product Detail Modal ─────────────────────────────────────────────────────
function ProductDetailModal({
  product,
  variant,
  onSelectVariant,
  onClose,
}: {
  product: Product;
  variant: ProductVariant;
  onSelectVariant: (v: ProductVariant) => void;
  onClose: () => void;
}) {
  const gallery =
    variant.images && variant.images.length > 0
      ? variant.images
      : product.images && product.images.length > 0
      ? product.images
      : [{ url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600", publicId: "fallback" }];

  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [variant.sku, variant.finish, variant.size?.value, variant.size?.unit]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const displayPrice = variant.discountPrice ?? variant.price;
  const hasDiscount = variant.discountPrice && variant.price && variant.discountPrice < variant.price;
  const uniqueFinishes = Array.from(new Set(product.variants.map((v) => v.finish).filter(Boolean)));
  const uniqueSizes = Array.from(
    new Set(product.variants.map((v) => `${v.size?.value}${v.size?.unit || "mm"}`).filter(Boolean))
  );

  const getVariantMatch = (finish?: string, sizeLabel?: string) => {
    const currentSize = sizeLabel ?? `${variant.size?.value}${variant.size?.unit || "mm"}`;
    const currentFinish = finish ?? variant.finish;

    return (
      product.variants.find(
        (v) => v.finish === currentFinish && `${v.size?.value}${v.size?.unit || "mm"}` === currentSize
      ) ||
      product.variants.find((v) => v.finish === currentFinish) ||
      product.variants.find((v) => `${v.size?.value}${v.size?.unit || "mm"}` === currentSize) ||
      product.variants[0] ||
      null
    );
  };

  const selectByFinish = (finish: string) => {
    const match = getVariantMatch(finish);
    if (match) onSelectVariant(match);
  };

  const selectBySize = (sizeLabel: string) => {
    const match = getVariantMatch(variant.finish, sizeLabel);
    if (match) onSelectVariant(match);
  };

  const highlightPoints = [
    product.specifications?.material && `Material: ${product.specifications.material}`,
    product.specifications?.mechanism && `Mechanism: ${product.specifications.mechanism}`,
    product.specifications?.weightCapacity && `Capacity: ${product.specifications.weightCapacity}`,
    product.specifications?.packagingUnit && `Packaging: ${product.specifications.packagingUnit}`,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border border-foreground/15 bg-background shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:max-w-6xl sm:rounded-[28px]"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-sm text-white transition-colors hover:bg-black"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="p-4 sm:p-6 xl:sticky xl:top-0 xl:self-start">
              <div className="rounded-[24px] border border-foreground/10 bg-foreground/[0.025] p-3 sm:p-4">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-foreground/[0.04]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${variant.sku || variant.finish}-${gallery[activeImg]?.publicId || gallery[activeImg]?.url}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={gallery[activeImg]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {gallery.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {gallery.map((img, i) => (
                      <button
                        key={img.publicId || i}
                        onClick={() => setActiveImg(i)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          i === activeImg ? "border-primary" : "border-foreground/10 hover:border-foreground/30"
                        }`}
                      >
                        <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {product.specifications?.material || "Premium Alloy"}
                </span>
                {variant.sku && (
                  <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[10px] font-mono text-foreground/45">
                    SKU: {variant.sku}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{product.name}</h2>
                <p className="mt-2 text-sm text-foreground/60">Premium finish • crafted for durability and everyday elegance</p>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-black text-foreground">₹{variant.discountPrice}</span>
                      <span className="text-sm text-foreground/35 line-through">₹{variant.price}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30">
                        {Math.round(((variant.price! - variant.discountPrice!) / variant.price!) * 100)}% off
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-foreground">
                      {displayPrice !== undefined ? `₹${displayPrice}` : "Price on request"}
                    </span>
                  )}
                </div>
              </div>

              {uniqueFinishes.length > 1 && (
                <div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">Finish</span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueFinishes.map((finish) => {
                      const meta = getFinishMeta(finish);
                      const isActive = finish === variant.finish;
                      return (
                        <button
                          key={finish}
                          onClick={() => selectByFinish(finish)}
                          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all ${
                            isActive
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                          }`}
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: meta.color }}
                          />
                          <span>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {uniqueSizes.length > 1 && (
                <div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">Size</span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((sizeLabel) => (
                      <button
                        key={sizeLabel}
                        onClick={() => selectBySize(sizeLabel)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
                          sizeLabel === `${variant.size?.value}${variant.size?.unit || "mm"}`
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                        }`}
                      >
                        {sizeLabel}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {highlightPoints.length > 0 && (
                <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">Key details</div>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {highlightPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications?.includedComponents && product.specifications.includedComponents.length > 0 && (
                <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">Box inclusions</div>
                  <div className="flex flex-wrap gap-2">
                    {product.specifications.includedComponents.map((comp, idx) => (
                      <span key={idx} className="rounded-full border border-foreground/10 bg-background px-2.5 py-1 text-[11px] text-foreground/70">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {variant.isAvailable === false && (
                <div className="flex items-center justify-center rounded-xl bg-foreground/10 py-3 text-sm font-semibold text-foreground/60">
                  Variant out of stock
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-foreground/10 bg-foreground/[0.02] p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/55">Product details</h3>
              <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/70">
                {product.description.split(/\n+/).filter(Boolean).map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const [selectedFinish, setSelectedFinish] = useState<string>("All");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => { setMaxPrice(maxPriceInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [maxPriceInput]);

  useEffect(() => { setPage(1); }, [selectedSize, selectedMaterial, selectedFinish]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search.trim()) params.set("search", search.trim());
    if (selectedMaterial !== "All") params.set("material", selectedMaterial);
    if (selectedFinish !== "All") params.set("finish", selectedFinish);
    if (selectedSize !== "All") params.set("size", selectedSize);
    if (maxPrice < 500) params.set("maxPrice", String(maxPrice));

    axios
      .get(`${API_URL}/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalProducts(res.data.pagination?.total || res.data.data.length);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [page, limit, search, selectedMaterial, selectedFinish, selectedSize, maxPrice]);

  // Note: no more scroll-to-top-on-page-change needed for the modal itself,
  // but keep it since it's still nice when paginating the grid.
  const isFirstRender = useState(() => ({ current: true }))[0];
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, [page]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0] || null);
    // No more scrollTo — the modal pops up in place instead of an inline panel.
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const standardMaterials = ["All", "Zinc Alloy", "Brass"];
  const standardFinishes = ["All", "Brass", "Matt Black", "Chrome", "Antique Gold"];
  const standardSizes = ["All", "96mm", "128mm", "160mm"];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-12 bg-background text-foreground">
      {/* ── Product Detail Modal (popup instead of inline panel) ── */}
      <AnimatePresence>
        {selectedProduct && selectedVariant && (
          <ProductDetailModal
            product={selectedProduct}
            variant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 shrink-0 rounded-2xl p-5 md:sticky md:top-6 border border-foreground/10 bg-foreground/[0.02]">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-foreground/10">
            <h3 className="font-bold text-md uppercase tracking-wider text-foreground">Specifications</h3>
            <button
              onClick={() => { setMaxPriceInput(500); setMaxPrice(500); setSelectedSize("All"); setSelectedMaterial("All"); setSelectedFinish("All"); setSearchInput(""); setSearch(""); setPage(1); }}
              className="text-xs text-foreground/50 hover:text-primary hover:underline transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="font-semibold text-xs text-foreground/60">Price Limit</span>
              <span className="text-foreground">₹{maxPriceInput}</span>
            </div>
            <input type="range" min="10" max="500" step="5" value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(Number(e.target.value))}
              className="w-full accent-primary bg-foreground/10 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mb-6">
            <span className="text-xs font-semibold text-foreground/60 block mb-2">Base Structural Material</span>
            <div className="flex flex-col gap-1">
              {standardMaterials.map((mat) => (
                <button key={mat} onClick={() => setSelectedMaterial(mat)}
                  className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedMaterial === mat ? "bg-primary text-white font-bold" : "text-foreground/60 font-semibold hover:bg-foreground/5"}`}
                >{mat}</button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-xs font-semibold text-foreground/60 block mb-2">Hardware Finish</span>
            <div className="flex flex-col gap-1">
              {standardFinishes.map((fin) => (
                <button key={fin} onClick={() => setSelectedFinish(fin)}
                  className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedFinish === fin ? "bg-primary text-white font-bold" : "text-foreground/60 font-semibold hover:bg-foreground/5"}`}
                >{fin}</button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-foreground/60 block mb-2">Sizing Bounds</span>
            <div className="flex flex-wrap gap-1.5">
              {standardSizes.map((sz) => (
                <button key={sz} onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${selectedSize === sz ? "text-white bg-primary border-primary" : "text-foreground/55 border-foreground/15 hover:border-foreground/30"}`}
                >{sz}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          <div className="w-full mb-6">
            <input
              type="text"
              placeholder="Search components database by keyword parameters..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-sm border border-foreground/15 rounded-xl px-4 py-3 bg-background text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-foreground/8" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-foreground/8 rounded w-3/4" />
                    <div className="h-3 bg-foreground/8 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="w-full py-24 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/35 text-sm">
              No products match the specified parameters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => {
                const prices = product.variants.map((v) => v.discountPrice || v.price || 0);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                const finishes = Array.from(new Set(product.variants.map((v) => v.finish)));
                return (
                  <motion.div
                    key={product._id || product.slug || index}
                    layout="position"
                    onClick={() => handleProductClick(product)}
                    className="group border border-foreground/10 hover:border-primary/40 hover:bg-foreground/[0.02] rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-foreground/5 mb-4">
                        {product.images?.[0]?.url ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/20 text-sm">No Image</div>
                        )}
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                        <span className="text-sm font-black text-foreground whitespace-nowrap">from ₹{minPrice}</span>
                      </div>
                      <p className="text-xs text-foreground/45 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-foreground/8 group-hover:border-primary/20 flex items-center justify-between">
                      <span className="text-[10px] text-foreground/35 uppercase font-bold tracking-tight">Finishes</span>
                      <div className="flex gap-1 overflow-hidden max-w-[75%]">
                        {finishes.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-foreground/5 border border-foreground/10 text-foreground/55 rounded whitespace-nowrap">{f}</span>
                        ))}
                        {finishes.length > 3 && <span className="text-[9px] text-foreground/30 font-mono">+{finishes.length - 3}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalProducts > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 pt-6 border-t border-foreground/8">
              <div className="flex items-center gap-4">
                <span className="text-foreground/45 text-xs font-medium">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalProducts)} of {totalProducts}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/45 text-xs font-medium">Per page</span>
                  <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                    className="text-xs font-semibold border border-foreground/15 rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    {[12, 24, 48].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">{page}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <CategorySection />
      <ProductSection />
    </div>
  );
}
