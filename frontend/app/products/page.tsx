"use client";

import { useEffect, useMemo, useState } from "react";
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
  finish: string; // Brass, Matt Black, Chrome, Antique Gold
  size: {
    value: number; // e.g., 96, 128
    unit: "mm" | "inch" | "cm"; // default: mm
  };
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  images: {
    url: string;
    publicId: string;
  }[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category; // Ref to ProductCategory
  images: {
    url: string;
    publicId: string;
  }[];
  specifications: {
    material: string; // Zinc Alloy, Brass
    mechanism?: string;
    weightCapacity?: string;
    packagingUnit?: string; // default: Piece
    includedComponents?: string[];
  };
  variants: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await axios.get(`${apiUrl}/product-categories`);
        setCategories(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background text-foreground text-center w-full">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="h-8 bg-gray-400 w-48 rounded mb-10"></div>
          <div className="flex flex-row w-full h-112.5 px-2 gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-full flex-1 bg-gray-400 rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-500 bg-background w-full">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-background text-foreground overflow-hidden">
      {/* <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shop Categories
        </h2>
        <p className="text-sm opacity-60 mt-1">
          Hover over any collection to reveal details.
        </p>
      </div> */}

      {/* Full-width container viewport */}
      <div className="max-w-7xl mx-auto px-4 select-none">
        {/* Flex container that dictates the full available row layout */}
        <div className="flex flex-row items-center w-full h-80 gap-0 isolation-auto">
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
                style={{
                  zIndex: isHovered ? 50 : index,
                  // Negative margin creates the compact stacked "stairs" overlay layout
                  // marginLeft: index === 0 ? "0px" : "-2.5vw",
                }}
                // We use flex values to control horizontal contraction/expansion fluidly
                animate={{
                  flexGrow: isHovered ? 3.5 : 1,
                  // Unhovered items slightly dim down when another item is active
                  opacity: anyCardHovered && !isHovered ? 0.8 : 1,
                }}
                transition={{
                  type: "tween",
                  ease: [0.25, 1, 0.5, 1], // Fluid easing across X-axis
                  duration: 0.45,
                }}
              >
                <a
                  href={`/category/${category.slug}`}
                  className="block w-full h-full relative"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={
                        category.image?.url ||
                        "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      alt={category.name}
                      fill
                      sizes="(max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      priority={index < 5}
                    />
                  </div>

                  {/* Dynamic Dark Vignette Layer */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent transition-opacity duration-300" />

                  {/* Text Container */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white select-none pointer-events-none w-full min-w-70">
                    <motion.h3
                      layout="position"
                      className="text-lg font-bold tracking-wide truncate w-full"
                      animate={{
                        color: "white",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.name}
                    </motion.h3>

                    <motion.p
                      className="text-xs text-neutral-200 font-light mt-1 line-clamp-2 w-full"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{
                        duration: isHovered ? 0.3 : 0.1,
                        delay: isHovered ? 0.15 : 0,
                      }}
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  // Filter States
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const [selectedFinish, setSelectedFinish] = useState<string>("All");

  // Dynamic Data Fetching
  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    axios
      .get(`${apiUrl}/products`)
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Compute filtered listings down the data pipeline safely matching your schema definitions
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Text Search matching name or description boundaries
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      // 2. Dynamic Price checking targeting either the promo discount price or regular retail value
      const variantPrices = p.variants.map(
        (v) => v.discountPrice || v.price || 0,
      );
      const minAvailablePrice =
        variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
      const matchesPrice = minAvailablePrice <= maxPrice;

      // 3. Normalized Dimensions matching (e.g., matching "128mm")
      const matchesSize =
        selectedSize === "All" ||
        p.variants.some(
          (v) => `${v.size.value}${v.size.unit || "mm"}` === selectedSize,
        );

      // 4. Material Specs Matching
      const matchesMaterial =
        selectedMaterial === "All" ||
        (p.specifications?.material &&
          p.specifications.material === selectedMaterial);

      // 5. Architectural Finish surface type matching
      const matchesFinish =
        selectedFinish === "All" ||
        p.variants.some((v) => v.finish === selectedFinish);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesSize &&
        matchesMaterial &&
        matchesFinish
      );
    });
  }, [
    products,
    search,
    maxPrice,
    selectedSize,
    selectedMaterial,
    selectedFinish,
  ]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Automatically select the first in-stock or available default variant option choice
    setSelectedVariant(product.variants[0] || null);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Helper arrays for populating unique dynamic values inside your sidebar inputs
  const standardMaterials = ["All", "Zinc Alloy", "Brass"];
  const standardFinishes = [
    "All",
    "Brass",
    "Matt Black",
    "Chrome",
    "Antique Gold",
  ];
  const standardSizes = ["All", "96mm", "128mm", "160mm"];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-12 bg-background text-foreground">
      {/* DETAILED VIEW INTERACTIVE ANCHORED DRAWER LAYER */}
      <AnimatePresence>
        {selectedProduct && selectedVariant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-16 rounded-2xl border border-gray-400 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
          >
            {/* Left Frame: Large Image Display rendering variant-specific imagery */}
            <div className="relative h-87.5 md:h-112.5 w-full rounded-xl overflow-hidden bg-neutral-950">
              <Image
                src={
                  selectedVariant.images?.[0]?.url ||
                  selectedProduct.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"
                }
                alt={selectedProduct.name}
                width={1000}
                height={500}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                }}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-colors"
              >
                ✕ Close Details
              </button>
            </div>

            {/* Right Frame: Explicit Descriptions & Deep Specifications matching clean definitions */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded">
                    {selectedProduct.specifications?.material ||
                      "Premium Alloy"}
                  </span>
                  {selectedVariant.sku && (
                    <span className="text-[10px] text-neutral-500 font-mono">
                      SKU: {selectedVariant.sku}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold tracking-tight mt-2">
                  {selectedProduct.name}
                </h2>

                {/* Core Pricing Engine parsing active markdown states */}
                <div className="flex items-baseline gap-3 mt-3">
                  {selectedVariant.discountPrice ? (
                    <>
                      <span className="text-2xl font-black text-black">
                        &#8377;
                        {selectedVariant.discountPrice}
                      </span>
                      <span className="text-md line-through text-neutral-500">
                        &#8377;
                        {selectedVariant.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-black">
                      &#8377;
                      {selectedVariant.price}
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Parametric Specification Data Deck Grid */}
                <div className="grid grid-cols-2 gap-3 my-6 bg-gray-500 p-4 rounded-xl text-xs border border-gray-400">
                  <div>
                    <span className="text-white text-xs block mb-0.5">
                      Finish Element
                    </span>
                    <span className="font-semibold text-white text-base">
                      {selectedVariant.finish}
                    </span>
                  </div>
                  <div>
                    <span className="text-white text-xs block mb-0.5">
                      Size Center-to-Center
                    </span>
                    <span className="font-semibold text-white text-base">
                      {selectedVariant.size?.value}
                      {selectedVariant.size?.unit || "mm"}
                    </span>
                  </div>
                  {selectedProduct.specifications?.weightCapacity && (
                    <div>
                      <span className="text-white text-xs block mb-0.5">
                        Weight Rating
                      </span>
                      <span className="font-semibold text-white text-base">
                        {selectedProduct.specifications.weightCapacity}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-white text-xs block mb-0.5">
                      Packaging Unit
                    </span>
                    <span className="font-semibold text-white text-base">
                      {selectedProduct.specifications?.packagingUnit || "Piece"}
                    </span>
                  </div>
                </div>

                {/* Included Assembly Components List mapping arrays safely */}
                {selectedProduct.specifications?.includedComponents &&
                  selectedProduct.specifications.includedComponents.length >
                    0 && (
                    <div className="mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider opacity-50 block mb-2">
                        Box Inclusions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.specifications.includedComponents.map(
                          (comp, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-neutral-900 px-2.5 py-1 rounded-md text-neutral-300 border border-neutral-800/50"
                            >
                              {comp}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Inline Compact Variants Selectors List */}
                <div className="mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-60 block mb-2.5">
                    Available Size & Finish Matrix
                  </label>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                    {selectedProduct.variants.map((v, index) => {
                      const isCurrentActive = selectedVariant.sku
                        ? selectedVariant.sku === v.sku
                        : index === 0;
                      return (
                        <button
                          key={v.sku || index}
                          onClick={() => setSelectedVariant(v)}
                          disabled={v.isAvailable === false}
                          className={`w-full flex items-center justify-between text-left text-xs p-3 rounded-xl border transition-all ${
                            isCurrentActive
                              ? "border-gray-400 bg-black text-white"
                              : "border-neutral-800 bg-white text-neutral-400"
                          } ${v.isAvailable === false ? "opacity-35 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-bold ${isCurrentActive ? "text-gray-300" : "text-black"}`}
                            >
                              {v.finish}
                            </span>
                            <span
                              className={` ${isCurrentActive ? "text-gray-300" : "text-black"}`}
                            >
                              |
                            </span>
                            <span
                              className={` ${isCurrentActive ? "text-gray-300" : "text-black"}`}
                            >
                              {v.size?.value}
                              {v.size?.unit || "mm"}
                            </span>
                          </div>
                          <div
                            className={`font-bold ${isCurrentActive ? "text-gray-300" : "text-black"}`}
                          >
                            &#8377;
                            {v.discountPrice || v.price}
                            {v.isAvailable === false && (
                              <span className="text-[10px] ml-2 text-red-400 font-normal">
                                (Out of Stock)
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedVariant.isAvailable !== false && (
                <div className="w-full mt-6 bg-gray-300 text-black font-semibold text-sm py-3 rounded-xl opacity-40 flex items-center justify-center">
                  Variant Out of Stock
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* LEFT COLUMN: STICKY COMPONENT FILTER CONTROLS SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0  rounded-2xl p-5 md:sticky md:top-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-400">
            <h3 className="font-bold text-md uppercase tracking-wider">
              Specifications
            </h3>
            <button
              onClick={() => {
                setMaxPrice(500);
                setSelectedSize("All");
                setSelectedMaterial("All");
                setSelectedFinish("All");
              }}
              className="text-xs hover:opacity-100 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Budget Limit Tracker */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="font-semibold text-xs opacity-70">
                Price Limit
              </span>
              <span className="text-white">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gray-500 bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Core Materials Compound Filter */}
          <div className="mb-6">
            <span className="text-xs font-semibold opacity-70 block mb-2">
              Base Structural Material
            </span>
            <div className="flex flex-col gap-1">
              {standardMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    selectedMaterial === mat
                      ? "bg-neutral-800 text-white font-bold "
                      : "text-neutral-700 font-semibold hover:bg-neutral-900/60 hover:text-white"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Finishes Metric Configuration Selector */}
          <div className="mb-6">
            <span className="text-xs font-semibold opacity-70 block mb-2">
              Hardware Finish
            </span>
            <div className="flex flex-col gap-1">
              {standardFinishes.map((fin) => (
                <button
                  key={fin}
                  onClick={() => setSelectedFinish(fin)}
                  className={`text-left w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    selectedFinish === fin
                      ? "bg-neutral-800 text-white font-bold"
                      : "text-neutral-700 font-semibold hover:bg-neutral-900/60 hover:text-white"
                  }`}
                >
                  {fin}
                </button>
              ))}
            </div>
          </div>

          {/* Size Dimension Center Metrics Stack */}
          <div>
            <span className="text-xs font-semibold opacity-70 block mb-2">
              Sizing Bounds
            </span>
            <div className="flex flex-wrap gap-1.5">
              {standardSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                    selectedSize === sz
                      ? "text-white bg-black border-white "
                      : " text-neutral-700 hover:border-neutral-700"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: SEARCH MATRIX & DYNAMIC GRID VIEW DECK */}
        <div className="flex-1 w-full">
          {/* Top Search bar input element */}
          <div className="w-full mb-6">
            <input
              type="text"
              placeholder="Search components database by keyword parameters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm border border-gray-400 rounded-xl px-4 py-3 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Grid View Content Parsing */}
          {filteredProducts.length === 0 ? (
            <div className="w-full py-24 text-center border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-sm">
              No component arrays match specified parameters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                // Calculate dynamic structural initial visual starting price
                const productPrices = product.variants.map(
                  (v) => v.discountPrice || v.price || 0,
                );
                const minimumProductPrice =
                  productPrices.length > 0 ? Math.min(...productPrices) : 0;

                // Safely extract unique finishes to print cleanly as tags at bottom of item cards
                const uniqueFinishes = Array.from(
                  new Set(product.variants.map((v) => v.finish)),
                );

                return (
                  <motion.div
                    key={product._id || product.slug || index}
                    layout="position"
                    onClick={() => handleProductClick(product)}
                    className="group border border-gray-400 hover:border-neutral-700/80 hover:bg-neutral-800 rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      {/* Graphics Thumbnail Container */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-900 mb-4">
                        <Image
                          src={
                            product.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"
                          }
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm group-hover:text-white transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-sm font-black text-black group-hover:text-white whitespace-nowrap">
                          from &#8377;
                          {minimumProductPrice}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* MINI COMPACT GRID ITEMS FOOTER REVEAL CHIPS */}
                    <div className="mt-4 pt-3 border-t border-neutral-900/60 group-hover:border-gray-400 flex items-center justify-between">
                      <span className="text-[12px] opacity-40 uppercase font-bold tracking-tight group-hover:text-white">
                        Finishes
                      </span>
                      <div className="flex gap-1 overflow-hidden max-w-[75%]">
                        {uniqueFinishes.slice(0, 3).map((finish, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded whitespace-nowrap group-hover:bg-neutral-700"
                          >
                            {finish}
                          </span>
                        ))}
                        {uniqueFinishes.length > 3 && (
                          <span className="text-[9px] opacity-40 text-white font-mono group-hover:text-black">
                            +{uniqueFinishes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
