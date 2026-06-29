"use client";

import { useEffect, useState } from "react";
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

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

        {/* Desktop: accordion expand on hover */}
        <div className="hidden sm:flex flex-row items-center w-full h-80 gap-0 isolation-auto">
          {categories.map((category, index) => {
            const isHovered = hoveredId === category._id;
            const anyCardHovered = hoveredId !== null;
            return (
              <motion.div
                key={category._id}
                layout="position"
                onMouseEnter={() => setHoveredId(category._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative h-full overflow-hidden bg-neutral-900 cursor-pointer first:rounded-l-2xl last:rounded-r-2xl"
                style={{ zIndex: isHovered ? 50 : index }}
                animate={{ flexGrow: isHovered ? 3.5 : 1, opacity: anyCardHovered && !isHovered ? 0.8 : 1 }}
                transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
              >
                <a href={`/category/${category.slug}`} className="block w-full h-full relative">
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={category.image?.url || "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=1074&auto=format&fit=crop"}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      priority={index < 5}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white pointer-events-none">
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
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

  const isFirstRender = useState(() => ({ current: true }))[0];
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, [page]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0] || null);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const standardMaterials = ["All", "Zinc Alloy", "Brass"];
  const standardFinishes = ["All", "Brass", "Matt Black", "Chrome", "Antique Gold"];
  const standardSizes = ["All", "96mm", "128mm", "160mm"];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-12 bg-background text-foreground">
      <AnimatePresence>
        {selectedProduct && selectedVariant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-16 rounded-2xl border border-foreground/15 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden bg-background"
          >
            <div className="relative h-[350px] md:h-[450px] w-full rounded-xl overflow-hidden bg-foreground/5">
              <Image
                src={selectedVariant.images?.[0]?.url || selectedProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"}
                alt={selectedProduct.name}
                width={1000}
                height={500}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-colors"
              >
                ✕ Close Details
              </button>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    {selectedProduct.specifications?.material || "Premium Alloy"}
                  </span>
                  {selectedVariant.sku && (
                    <span className="text-[10px] text-foreground/40 font-mono">SKU: {selectedVariant.sku}</span>
                  )}
                </div>

                <h2 className="text-3xl font-bold tracking-tight mt-2 text-foreground">{selectedProduct.name}</h2>

                <div className="flex items-baseline gap-3 mt-3">
                  {selectedVariant.discountPrice ? (
                    <>
                      <span className="text-2xl font-black text-foreground">₹{selectedVariant.discountPrice}</span>
                      <span className="text-md line-through text-foreground/35">₹{selectedVariant.price}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-foreground">₹{selectedVariant.price}</span>
                  )}
                </div>

                <p className="text-sm text-foreground/55 mt-4 leading-relaxed">{selectedProduct.description}</p>

                <div className="grid grid-cols-2 gap-3 my-6 bg-foreground/[0.03] border border-foreground/10 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-foreground/40 text-xs block mb-0.5">Finish</span>
                    <span className="font-semibold text-foreground text-base">{selectedVariant.finish}</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 text-xs block mb-0.5">Size</span>
                    <span className="font-semibold text-foreground text-base">{selectedVariant.size?.value}{selectedVariant.size?.unit || "mm"}</span>
                  </div>
                  {selectedProduct.specifications?.weightCapacity && (
                    <div>
                      <span className="text-foreground/40 text-xs block mb-0.5">Weight Rating</span>
                      <span className="font-semibold text-foreground text-base">{selectedProduct.specifications.weightCapacity}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-foreground/40 text-xs block mb-0.5">Packaging</span>
                    <span className="font-semibold text-foreground text-base">{selectedProduct.specifications?.packagingUnit || "Piece"}</span>
                  </div>
                </div>

                {selectedProduct.specifications?.includedComponents && selectedProduct.specifications.includedComponents.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 block mb-2">Box Inclusions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.specifications.includedComponents.map((comp, idx) => (
                        <span key={idx} className="text-[11px] bg-foreground/5 px-2.5 py-1 rounded-md text-foreground/65 border border-foreground/10">{comp}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/50 block mb-2.5">Available Variants</label>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {selectedProduct.variants.map((v, index) => {
                      const isActive = selectedVariant.sku ? selectedVariant.sku === v.sku : index === 0;
                      return (
                        <button
                          key={v.sku || index}
                          onClick={() => setSelectedVariant(v)}
                          disabled={v.isAvailable === false}
                          className={`w-full flex items-center justify-between text-left text-xs p-3 rounded-xl border transition-all ${isActive ? "border-primary bg-primary/8 text-foreground" : "border-foreground/10 text-foreground/55 hover:border-foreground/25"} ${v.isAvailable === false ? "opacity-35 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-3 font-semibold">
                            <span>{v.finish}</span>
                            <span className="text-foreground/25">|</span>
                            <span>{v.size?.value}{v.size?.unit || "mm"}</span>
                          </div>
                          <div className="font-bold">
                            ₹{v.discountPrice || v.price}
                            {v.isAvailable === false && <span className="text-[10px] ml-2 text-red-400 font-normal">(Out of Stock)</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedVariant.isAvailable === false && (
                <div className="w-full mt-6 bg-foreground/10 text-foreground/50 font-semibold text-sm py-3 rounded-xl flex items-center justify-center">
                  Variant Out of Stock
                </div>
              )}
            </div>
          </motion.div>
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


// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
//   image: { url: string };
//   description: string;
// }

// interface ProductVariant {
//   sku?: string;
//   finish: string;
//   size: { value: number; unit: "mm" | "inch" | "cm" };
//   price?: number;
//   discountPrice?: number;
//   isAvailable?: boolean;
//   images: { url: string; publicId: string }[];
// }

// interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   category: Category;
//   images: { url: string; publicId: string }[];
//   specifications: {
//     material: string;
//     mechanism?: string;
//     weightCapacity?: string;
//     packagingUnit?: string;
//     includedComponents?: string[];
//   };
//   variants: ProductVariant[];
//   isFeatured?: boolean;
//   isActive?: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// function CategorySection() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hoveredId, setHoveredId] = useState<string | null>(null);

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/product-categories`)
//       .then((res) => { setCategories(res.data.data); setLoading(false); })
//       .catch(() => { setError("Failed to load categories."); setLoading(false); });
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-16 bg-background text-foreground text-center w-full">
//         <div className="animate-pulse flex flex-col items-center w-full">
//           <div className="h-8 bg-foreground/10 w-48 rounded mb-10" />
//           <div className="flex flex-row w-full h-80 px-2 gap-2">
//             {[...Array(5)].map((_, i) => <div key={i} className="h-full flex-1 bg-foreground/10 rounded-2xl" />)}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) return <div className="py-16 text-center text-red-500">{error}</div>;

//   return (
//     <section className="w-full py-10 sm:py-16 bg-background text-foreground overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 select-none">

//         {/* ── Mobile: horizontal slider ── */}
//         <div className="sm:hidden relative">
//           <button
//             onClick={() => document.getElementById("cat-slider")?.scrollBy({ left: -200, behavior: "smooth" })}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center -translate-x-1"
//           >
//             <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           <div
//             id="cat-slider"
//             className="flex gap-3 overflow-x-auto scroll-smooth px-8"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {categories.map((category) => (
//               <a
//                 key={category._id}
//                 href={`/category/${category.slug}`}
//                 className="relative flex-shrink-0 w-44 h-36 rounded-2xl overflow-hidden bg-neutral-900 block"
//               >
//                 {category.image?.url && (
//                   <Image src={category.image.url} alt={category.name} fill sizes="176px" className="object-cover" />
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
//                 <div className="absolute bottom-0 left-0 right-0 p-3">
//                   <p className="text-white text-xs font-bold leading-tight line-clamp-2">{category.name}</p>
//                 </div>
//               </a>
//             ))}
//           </div>

//           <button
//             onClick={() => document.getElementById("cat-slider")?.scrollBy({ left: 200, behavior: "smooth" })}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center translate-x-1"
//           >
//             <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>

//         {/* ── Desktop: accordion expand on hover ── */}
//         <div className="hidden sm:flex flex-row items-center w-full h-80 gap-0 isolation-auto">
//           {categories.map((category, index) => {
//             const isHovered = hoveredId === category._id;
//             const anyCardHovered = hoveredId !== null;
//             return (
//               <motion.div
//                 key={category._id}
//                 layout="position"
//                 onMouseEnter={() => setHoveredId(category._id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 className="relative h-full overflow-hidden bg-neutral-900 cursor-pointer first:rounded-l-2xl last:rounded-r-2xl"
//                 style={{ zIndex: isHovered ? 50 : index }}
//                 animate={{ flexGrow: isHovered ? 3.5 : 1, opacity: anyCardHovered && !isHovered ? 0.8 : 1 }}
//                 transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
//               >
//                 <a href={`/category/${category.slug}`} className="block w-full h-full relative">
//                   <div className="absolute inset-0 w-full h-full">
//                     <Image
//                       src={category.image?.url || "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=1074&auto=format&fit=crop"}
//                       alt={category.name}
//                       fill
//                       sizes="(max-width: 1200px) 50vw, 25vw"
//                       className="object-cover"
//                       priority={index < 5}
//                     />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
//                   <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white pointer-events-none">
//                     <p className="text-lg font-bold tracking-wide truncate">{category.name}</p>
//                     <motion.p
//                       className="text-xs text-neutral-200 font-light mt-1 line-clamp-2"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: isHovered ? 1 : 0 }}
//                       transition={{ duration: isHovered ? 0.3 : 0.1, delay: isHovered ? 0.15 : 0 }}
//                     >
//                       {category.description || "Explore curated collections."}
//                     </motion.p>
//                   </div>
//                 </a>
//               </motion.div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }

// function ProductSection() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [maxPriceInput, setMaxPriceInput] = useState<number>(500);
//   const [maxPrice, setMaxPrice] = useState<number>(500);
//   const [selectedSize, setSelectedSize] = useState<string>("All");
//   const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
//   const [selectedFinish, setSelectedFinish] = useState<string>("All");

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(12);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);

//   useEffect(() => {
//     const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   useEffect(() => {
//     const timer = setTimeout(() => { setMaxPrice(maxPriceInput); setPage(1); }, 400);
//     return () => clearTimeout(timer);
//   }, [maxPriceInput]);

//   useEffect(() => { setPage(1); }, [selectedSize, selectedMaterial, selectedFinish]);

//   useEffect(() => {
//     setLoading(true);
//     const params = new URLSearchParams();
//     params.set("page", String(page));
//     params.set("limit", String(limit));
//     if (search.trim()) params.set("search", search.trim());
//     if (selectedMaterial !== "All") params.set("material", selectedMaterial);
//     if (selectedFinish !== "All") params.set("finish", selectedFinish);
//     if (selectedSize !== "All") params.set("size", selectedSize);
//     if (maxPrice < 500) params.set("maxPrice", String(maxPrice));

//     axios
//       .get(`${API_URL}/products?${params.toString()}`)
//       .then((res) => {
//         setProducts(res.data.data);
//         setTotalPages(res.data.pagination?.totalPages || 1);
//         setTotalProducts(res.data.pagination?.total || res.data.data.length);
//       })
//       .catch((err) => console.error("Error fetching products:", err))
//       .finally(() => setLoading(false));
//   }, [page, limit, search, selectedMaterial, selectedFinish, selectedSize, maxPrice]);

//   const isFirstRender = useState(() => ({ current: true }))[0];
//   useEffect(() => {
//     if (isFirstRender.current) { isFirstRender.current = false; return; }
//     window.scrollTo({ top: 400, behavior: "smooth" });
//   }, [page]);

//   const handleProductClick = (product: Product) => {
//     setSelectedProduct(product);
//     setSelectedVariant(product.variants[0] || null);
//     window.scrollTo({ top: 400, behavior: "smooth" });
//   };

//   const standardMaterials = ["All", "Zinc Alloy", "Brass"];
//   const standardFinishes = ["All", "Brass", "Matt Black", "Chrome", "Antique Gold"];
//   const standardSizes = ["All", "96mm", "128mm", "160mm"];

//   return (
//     <section className="w-full max-w-7xl mx-auto px-6 pb-12 bg-background text-foreground">
//       <AnimatePresence>
//         {selectedProduct && selectedVariant && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="w-full mb-16 rounded-2xl border border-foreground/15 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden bg-background"
//           >
//             <div className="relative h-[350px] md:h-[450px] w-full rounded-xl overflow-hidden bg-foreground/5">
//               <Image
//                 src={selectedVariant.images?.[0]?.url || selectedProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"}
//                 alt={selectedProduct.name}
//                 width={1000}
//                 height={500}
//                 className="object-cover w-full h-full"
//               />
//               <button
//                 onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }}
//                 className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-colors"
//               >
//                 ✕ Close Details
//               </button>
//             </div>

//             <div className="flex flex-col justify-between">
//               <div>
//                 <div className="flex items-center justify-between gap-2">
//                   <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
//                     {selectedProduct.specifications?.material || "Premium Alloy"}
//                   </span>
//                   {selectedVariant.sku && (
//                     <span className="text-[10px] text-foreground/40 font-mono">SKU: {selectedVariant.sku}</span>
//                   )}
//                 </div>

//                 <h2 className="text-3xl font-bold tracking-tight mt-2 text-foreground">{selectedProduct.name}</h2>

//                 <div className="flex items-baseline gap-3 mt-3">
//                   {selectedVariant.discountPrice ? (
//                     <>
//                       <span className="text-2xl font-black text-foreground">₹{selectedVariant.discountPrice}</span>
//                       <span className="text-md line-through text-foreground/35">₹{selectedVariant.price}</span>
//                     </>
//                   ) : (
//                     <span className="text-2xl font-black text-foreground">₹{selectedVariant.price}</span>
//                   )}
//                 </div>

//                 <p className="text-sm text-foreground/55 mt-4 leading-relaxed">{selectedProduct.description}</p>

//                 <div className="grid grid-cols-2 gap-3 my-6 bg-foreground/[0.03] border border-foreground/10 p-4 rounded-xl text-xs">
//                   <div>
//                     <span className="text-foreground/40 text-xs block mb-0.5">Finish</span>
//                     <span className="font-semibold text-foreground text-base">{selectedVariant.finish}</span>
//                   </div>
//                   <div>
//                     <span className="text-foreground/40 text-xs block mb-0.5">Size</span>
//                     <span className="font-semibold text-foreground text-base">{selectedVariant.size?.value}{selectedVariant.size?.unit || "mm"}</span>
//                   </div>
//                   {selectedProduct.specifications?.weightCapacity && (
//                     <div>
//                       <span className="text-foreground/40 text-xs block mb-0.5">Weight Rating</span>
//                       <span className="font-semibold text-foreground text-base">{selectedProduct.specifications.weightCapacity}</span>
//                     </div>
//                   )}
//                   <div>
//                     <span className="text-foreground/40 text-xs block mb-0.5">Packaging</span>
//                     <span className="font-semibold text-foreground text-base">{selectedProduct.specifications?.packagingUnit || "Piece"}</span>
//                   </div>
//                 </div>

//                 {selectedProduct.specifications?.includedComponents && selectedProduct.specifications.includedComponents.length > 0 && (
//                   <div className="mb-6">
//                     <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/45 block mb-2">Box Inclusions</span>
//                     <div className="flex flex-wrap gap-1.5">
//                       {selectedProduct.specifications.includedComponents.map((comp, idx) => (
//                         <span key={idx} className="text-[11px] bg-foreground/5 px-2.5 py-1 rounded-md text-foreground/65 border border-foreground/10">{comp}</span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/50 block mb-2.5">Available Variants</label>
//                   <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
//                     {selectedProduct.variants.map((v, index) => {
//                       const isActive = selectedVariant.sku ? selectedVariant.sku === v.sku : index === 0;
//                       return (
//                         <button
//                           key={v.sku || index}
//                           onClick={() => setSelectedVariant(v)}
//                           disabled={v.isAvailable === false}
//                           className={`w-full flex items-center justify-between text-left text-xs p-3 rounded-xl border transition-all ${isActive ? "border-primary bg-primary/8 text-foreground" : "border-foreground/10 text-foreground/55 hover:border-foreground/25"} ${v.isAvailable === false ? "opacity-35 cursor-not-allowed" : ""}`}
//                         >
//                           <div className="flex items-center gap-3 font-semibold">
//                             <span>{v.finish}</span>
//                             <span className="text-foreground/25">|</span>
//                             <span>{v.size?.value}{v.size?.unit || "mm"}</span>
//                           </div>
//                           <div className="font-bold">
//                             ₹{v.discountPrice || v.price}
//                             {v.isAvailable === false && <span className="text-[10px] ml-2 text-red-400 font-normal">(Out of Stock)</span>}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {selectedVariant.isAvailable === false && (
//                 <div className="w-full mt-6 bg-foreground/10 text-foreground/50 font-semibold text-sm py-3 rounded-xl flex items-center justify-center">
//                   Variant Out of Stock
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="flex flex-col md:flex-row gap-8 items-start">
//         {/* Filter Sidebar */}
//         <aside className="w-full md:w-64 shrink-0 rounded-2xl p-5 md:sticky md:top-6 border border-foreground/10 bg-foreground/[0.02]">
//           <div className="flex justify-between items-center mb-6 pb-2 border-b border-foreground/10">
//             <h3 className="font-bold text-md uppercase tracking-wider text-foreground">Specifications</h3>
//             <button
//               onClick={() => { setMaxPriceInput(500); setMaxPrice(500); setSelectedSize("All"); setSelectedMaterial("All"); setSelectedFinish("All"); setSearchInput(""); setSearch(""); setPage(1); }}
//               className="text-xs text-foreground/50 hover:text-primary hover:underline transition-colors"
//             >
//               Reset All
//             </button>
//           </div>

//           <div className="mb-6">
//             <div className="flex justify-between text-xs font-medium mb-2">
//               <span className="font-semibold text-xs text-foreground/60">Price Limit</span>
//               <span className="text-foreground">₹{maxPriceInput}</span>
//             </div>
//             <input type="range" min="10" max="500" step="5" value={maxPriceInput}
//               onChange={(e) => setMaxPriceInput(Number(e.target.value))}
//               className="w-full accent-primary bg-foreground/10 h-1 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>

//           <div className="mb-6">
//             <span className="text-xs font-semibold text-foreground/60 block mb-2">Base Structural Material</span>
//             <div className="flex flex-col gap-1">
//               {standardMaterials.map((mat) => (
//                 <button key={mat} onClick={() => setSelectedMaterial(mat)}
//                   className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedMaterial === mat ? "bg-primary text-white font-bold" : "text-foreground/60 font-semibold hover:bg-foreground/5"}`}
//                 >{mat}</button>
//               ))}
//             </div>
//           </div>

//           <div className="mb-6">
//             <span className="text-xs font-semibold text-foreground/60 block mb-2">Hardware Finish</span>
//             <div className="flex flex-col gap-1">
//               {standardFinishes.map((fin) => (
//                 <button key={fin} onClick={() => setSelectedFinish(fin)}
//                   className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedFinish === fin ? "bg-primary text-white font-bold" : "text-foreground/60 font-semibold hover:bg-foreground/5"}`}
//                 >{fin}</button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <span className="text-xs font-semibold text-foreground/60 block mb-2">Sizing Bounds</span>
//             <div className="flex flex-wrap gap-1.5">
//               {standardSizes.map((sz) => (
//                 <button key={sz} onClick={() => setSelectedSize(sz)}
//                   className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${selectedSize === sz ? "text-white bg-primary border-primary" : "text-foreground/55 border-foreground/15 hover:border-foreground/30"}`}
//                 >{sz}</button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Products Grid */}
//         <div className="flex-1 w-full">
//           <div className="w-full mb-6">
//             <input
//               type="text"
//               placeholder="Search components database by keyword parameters..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="w-full text-sm border border-foreground/15 rounded-xl px-4 py-3 bg-background text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary transition-colors"
//             />
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Array.from({ length: limit }).map((_, i) => (
//                 <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
//                   <div className="aspect-square bg-foreground/8" />
//                   <div className="p-4 space-y-2">
//                     <div className="h-3 bg-foreground/8 rounded w-3/4" />
//                     <div className="h-3 bg-foreground/8 rounded w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : products.length === 0 ? (
//             <div className="w-full py-24 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/35 text-sm">
//               No products match the specified parameters.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product, index) => {
//                 const prices = product.variants.map((v) => v.discountPrice || v.price || 0);
//                 const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
//                 const finishes = Array.from(new Set(product.variants.map((v) => v.finish)));
//                 return (
//                   <motion.div
//                     key={product._id || product.slug || index}
//                     layout="position"
//                     onClick={() => handleProductClick(product)}
//                     className="group border border-foreground/10 hover:border-primary/40 hover:bg-foreground/[0.02] rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all duration-300"
//                   >
//                     <div>
//                       <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-foreground/5 mb-4">
//                         {product.images?.[0]?.url ? (
//                           <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-foreground/20 text-sm">No Image</div>
//                         )}
//                       </div>
//                       <div className="flex justify-between items-start gap-2">
//                         <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
//                         <span className="text-sm font-black text-foreground whitespace-nowrap">from ₹{minPrice}</span>
//                       </div>
//                       <p className="text-xs text-foreground/45 mt-1 line-clamp-2">{product.description}</p>
//                     </div>
//                     <div className="mt-4 pt-3 border-t border-foreground/8 group-hover:border-primary/20 flex items-center justify-between">
//                       <span className="text-[10px] text-foreground/35 uppercase font-bold tracking-tight">Finishes</span>
//                       <div className="flex gap-1 overflow-hidden max-w-[75%]">
//                         {finishes.slice(0, 3).map((f, idx) => (
//                           <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-foreground/5 border border-foreground/10 text-foreground/55 rounded whitespace-nowrap">{f}</span>
//                         ))}
//                         {finishes.length > 3 && <span className="text-[9px] text-foreground/30 font-mono">+{finishes.length - 3}</span>}
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Pagination */}
//           {!loading && totalProducts > 0 && (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 pt-6 border-t border-foreground/8">
//               <div className="flex items-center gap-4">
//                 <span className="text-foreground/45 text-xs font-medium">
//                   Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalProducts)} of {totalProducts}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-foreground/45 text-xs font-medium">Per page</span>
//                   <select
//                     value={limit}
//                     onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
//                     className="text-xs font-semibold border border-foreground/15 rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
//                   >
//                     {[12, 24, 48].map((n) => <option key={n} value={n}>{n}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
//                 >
//                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Previous
//                 </button>
//                 <span className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">{page}</span>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 text-xs font-semibold text-foreground/55 hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
//                 >
//                   Next
//                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function Page() {
//   return (
//     <div className="flex flex-col w-full justify-center items-center">
//       <CategorySection />
//       <ProductSection />
//     </div>
//   );
// }










