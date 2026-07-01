


// app/category/[slug]/page.tsx

// app/category/[slug]/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Product, ProductVariant } from "@/types/hardware";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── PRODUCT DETAIL DRAWER ──
function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  const [variant, setVariant] = useState<ProductVariant>(product.variants[0]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-8 rounded-2xl border border-foreground/15 overflow-hidden bg-background"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Image */}
        <div className="relative min-h-72 md:min-h-96 bg-foreground/5">
          <Image
            src={variant.images?.[0]?.url || product.images?.[0]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 border border-foreground/15
                       flex items-center justify-center text-foreground text-xs font-bold hover:bg-foreground hover:text-background transition-all"
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[500px]">

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">
              {product.specifications?.material || "Premium"}
            </span>
            <h2 className="font-black text-foreground text-2xl mt-3 leading-tight">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-2">
              {variant.discountPrice ? (
                <>
                  <span className="text-2xl font-black text-foreground">₹{variant.discountPrice}</span>
                  <span className="text-sm line-through text-foreground/35">₹{variant.price}</span>
                </>
              ) : variant.price ? (
                <span className="text-2xl font-black text-foreground">₹{variant.price}</span>
              ) : (
                <span className="text-sm font-semibold text-foreground/50">Price on request</span>
              )}
            </div>

            <p className="text-foreground/55 text-sm leading-relaxed mt-3">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-foreground/[0.03] border border-foreground/8">
            {[
              { label: "Finish", value: variant.finish },
              { label: "Size", value: `${variant.size?.value}${variant.size?.unit || "mm"}` },
              { label: "Material", value: product.specifications?.material },
              { label: "Unit", value: product.specifications?.packagingUnit || "Piece" },
            ].map((s) => s.value && (
              <div key={s.label}>
                <div className="text-foreground/35 text-[10px] font-bold uppercase tracking-widest mb-0.5">{s.label}</div>
                <div className="text-foreground font-bold text-sm">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div>
              <div className="text-foreground/35 text-[10px] font-bold uppercase tracking-widest mb-2">Select Variant</div>
              <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                {product.variants.map((v, i) => {
                  const active = variant.sku ? variant.sku === v.sku : i === 0;
                  return (
                    <button
                      key={v.sku || i}
                      onClick={() => setVariant(v)}
                      disabled={v.isAvailable === false}
                      className={`w-full flex items-center justify-between text-xs p-3 rounded-xl border transition-all
                        ${active ? "border-primary bg-primary/8 text-foreground" : "border-foreground/10 text-foreground/55 hover:border-foreground/25"}
                        ${v.isAvailable === false ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="font-semibold">{v.finish} | {v.size?.value}{v.size?.unit || "mm"}</span>
                      <span className="font-bold">
                        {v.discountPrice || v.price ? `₹${v.discountPrice || v.price}` : "—"}
                        {v.isAvailable === false && <span className="text-red-400 text-[10px] ml-2 font-normal">Out of Stock</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${variant.finish}, ${variant.size?.value}${variant.size?.unit || "mm"})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm text-center flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-300">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Inquire on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ──
export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [finish, setFinish] = useState("All");
  const [size, setSize] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(12);

  // Debounce search input, then apply it and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    // Step 1: fetch category by slug to get its _id
    // Step 2: use _id to fetch products (backend expects MongoDB _id not slug)
    axios.get(`${API}/product-categories/${slug}`)
      .then((catRes) => {
        const cat = catRes.data.data;
        setCategory(cat);
        const params = new URLSearchParams();
        params.set("category", cat._id);
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search.trim()) params.set("search", search.trim());
        return axios.get(`${API}/products?${params.toString()}`);
      })
      .then((prodRes) => {
        setProducts(prodRes.data.data);
        setTotalPages(prodRes.data.pagination?.totalPages || 1);
        setTotalProducts(prodRes.data.pagination?.total || prodRes.data.data.length);
      })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [slug, page, search, limit]);

  // Scroll back to top of product grid when page changes (but not on initial mount)
  const isFirstRender = useState(() => ({ current: true }))[0];
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 280, behavior: "smooth" });
  }, [page]);

  const allFinishes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => s.add(v.finish)));
    return ["All", ...Array.from(s)];
  }, [products]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => s.add(`${v.size.value}${v.size.unit || "mm"}`)));
    return ["All", ...Array.from(s)];
  }, [products]);

  const filtered = useMemo(() => products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchFinish = finish === "All" || p.variants.some((v) => v.finish === finish);
    const matchSize = size === "All" || p.variants.some((v) => `${v.size.value}${v.size.unit || "mm"}` === size);
    return matchSearch && matchFinish && matchSize;
  }), [products, search, finish, size]);

  if (loading && !category) return <Skeleton />;

  if (!category) return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-foreground/50 text-sm mb-4">Category not found</p>
        <Link href="/" className="text-primary text-sm font-bold underline underline-offset-4">← Go Home</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── HERO BANNER ── */}
      <section className="relative h-52 sm:h-64 overflow-hidden">
        <Image
          src={category.image?.url || "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=1200"}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-5 left-5 flex items-center gap-2 text-white/55 text-xs font-semibold">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-10">
          <h1 className="text-white font-black text-3xl sm:text-4xl leading-tight tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/55 text-sm mt-1 max-w-lg">{category.description}</p>
          )}
          <p className="text-white/35 text-xs mt-1.5 font-semibold uppercase tracking-widest">
            {totalProducts} products
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <AnimatePresence>
          {selected && (
            <ProductDrawer
              product={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Sidebar */}
          <aside className="w-full md:w-52 shrink-0 md:sticky md:top-6">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-foreground/8">
                <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Filters</h3>
                <button
                  onClick={() => { setFinish("All"); setSize("All"); setSearchInput(""); setSearch(""); setPage(1); }}
                  className="text-foreground/35 text-xs hover:text-primary transition-colors font-semibold"
                >
                  Reset
                </button>
              </div>

              {/* Finish */}
              <div className="mb-5">
                <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Finish</span>
                <div className="flex flex-col gap-1">
                  {allFinishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFinish(f)}
                      className={`text-left w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${finish === f ? "bg-primary text-white" : "text-foreground/55 hover:bg-foreground/5 hover:text-foreground"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all
                        ${size === s ? "bg-primary text-white border-primary" : "border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-sm border border-foreground/15 rounded-xl px-4 py-3 bg-background text-foreground
                         placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors mb-6"
            />

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: limit }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-foreground/8" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-3 bg-foreground/8 rounded w-3/4" />
                      <div className="h-3 bg-foreground/8 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/30 text-sm">
                No products match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((product, i) => {
                  const prices = product.variants.map((v) => v.discountPrice || v.price || 0);
                  const minPrice = prices.length ? Math.min(...prices) : 0;
                  const finishes = [...new Set(product.variants.map((v) => v.finish))];
                  const isOpen = selected?._id === product._id;

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      onClick={() => {
                        setSelected(isOpen ? null : product);
                        setTimeout(() => window.scrollTo({ top: 280, behavior: "smooth" }), 60);
                      }}
                      className={`group rounded-2xl border cursor-pointer transition-all duration-300 bg-background overflow-hidden
                        ${isOpen ? "border-primary shadow-lg" : "border-foreground/10 hover:border-foreground/25 hover:shadow-md"}`}
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-foreground/5 overflow-hidden">
                        <Image
                          src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        {isOpen && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          {minPrice > 0 && (
                            <span className="text-foreground font-black text-sm whitespace-nowrap flex-shrink-0">₹{minPrice}</span>
                          )}
                        </div>
                        <p className="text-foreground/40 text-xs line-clamp-1">{product.description}</p>

                        <div className="mt-3 pt-2.5 border-t border-foreground/8 flex items-center justify-between gap-2">
                          <span className="text-foreground/25 text-[10px] font-bold uppercase tracking-widest">Finishes</span>
                          <div className="flex gap-1 flex-wrap justify-end">
                            {finishes.slice(0, 3).map((f, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-foreground/5 border border-foreground/10 text-foreground/50 rounded">
                                {f}
                              </span>
                            ))}
                            {finishes.length > 3 && (
                              <span className="text-[9px] text-foreground/30 font-mono">+{finishes.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalProducts > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 pt-6 border-t border-foreground/8">

                {/* Left: showing count + per-page selector */}
                <div className="flex items-center gap-4">
                  <span className="text-foreground/45 text-xs font-medium">
                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalProducts)} of {totalProducts}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-foreground/45 text-xs font-medium">Per page</span>
                    <select
                      value={limit}
                      onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                      className="text-xs font-semibold border border-foreground/15 rounded-lg px-2 py-1.5 bg-background text-foreground
                                 focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      {[12, 24, 48].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right: previous / page / next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold
                               text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200
                               disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground/55 disabled:hover:border-foreground/15"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <span className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {page}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold
                               text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200
                               disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-foreground/55 disabled:hover:border-foreground/15"
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
    </main>
  );
}

function Skeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-52 sm:h-64 bg-foreground/8 animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          <div className="w-52 shrink-0 h-56 bg-foreground/5 rounded-2xl animate-pulse" />
          <div className="flex-1 grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
                <div className="aspect-square bg-foreground/8" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-foreground/8 rounded w-3/4" />
                  <div className="h-3 bg-foreground/8 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}








