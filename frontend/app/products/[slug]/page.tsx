"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

interface ProductVariant {
  sku?: string;
  finish: string;
  size?: { value?: number; unit?: "mm" | "inch" | "cm" };
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  images?: { url: string; publicId: string }[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: { url: string; publicId: string }[];
  specifications: {
    material: string;
    mechanism?: string;
    weightCapacity?: string;
    packagingUnit?: string;
    includedComponents?: string[];
  };
  variants: ProductVariant[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600";

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

function ProductDetailContent({
  product,
  variant,
  onSelectVariant,
  onClose,
}: {
  product: Product;
  variant: ProductVariant | null;
  onSelectVariant: (v: ProductVariant) => void;
  onClose?: () => void;
}) {
  const safeVariant = variant ?? product?.variants?.[0] ?? null;

  const gallery = useMemo(() => {
    if (!safeVariant) {
      return product.images?.length ? product.images : [{ url: FALLBACK_IMG, publicId: "fallback" }];
    }

    return safeVariant.images && safeVariant.images.length > 0
      ? safeVariant.images
      : product.images && product.images.length > 0
      ? product.images
      : [{ url: FALLBACK_IMG, publicId: "fallback" }];
  }, [product.images, safeVariant]);

  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [safeVariant?.sku, safeVariant?.finish, safeVariant?.size?.value, safeVariant?.size?.unit]);

  if (!safeVariant) {
    return (
      <main className="max-h-[92vh] overflow-y-auto bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8 text-center">
          <h1 className="text-2xl font-semibold">Product details are not available yet.</h1>
          <p className="mt-3 text-sm text-foreground/60">Please try again or contact support.</p>
        </div>
      </main>
    );
  }

  const displayPrice = safeVariant.discountPrice ?? safeVariant.price;
  const hasDiscount = Boolean(safeVariant.discountPrice && safeVariant.price && safeVariant.discountPrice < safeVariant.price);

  const uniqueFinishes = Array.from(new Set((product.variants || []).map((v) => v.finish).filter(Boolean)));
  const uniqueSizes = Array.from(
    new Set((product.variants || []).map((v) => `${v.size?.value ?? ""}${v.size?.unit || "mm"}`).filter(Boolean))
  );

  const getVariantMatch = (finish?: string, sizeLabel?: string) => {
    const currentSize = sizeLabel ?? `${safeVariant.size?.value ?? ""}${safeVariant.size?.unit || "mm"}`;
    const currentFinish = finish ?? safeVariant.finish;

    return (
      product.variants.find(
        (v) => v.finish === currentFinish && `${v.size?.value ?? ""}${v.size?.unit || "mm"}` === currentSize
      ) ||
      product.variants.find((v) => v.finish === currentFinish) ||
      product.variants.find((v) => `${v.size?.value ?? ""}${v.size?.unit || "mm"}` === currentSize) ||
      product.variants[0] ||
      null
    );
  };

  const selectByFinish = (finish: string) => {
    const match = getVariantMatch(finish);
    if (match) onSelectVariant(match);
  };

  const selectBySize = (sizeLabel: string) => {
    const match = getVariantMatch(safeVariant.finish, sizeLabel);
    if (match) onSelectVariant(match);
  };

  const highlightPoints = [
    product.specifications?.material && `Material: ${product.specifications.material}`,
    product.specifications?.mechanism && `Mechanism: ${product.specifications.mechanism}`,
    product.specifications?.weightCapacity && `Capacity: ${product.specifications.weightCapacity}`,
    product.specifications?.packagingUnit && `Packaging: ${product.specifications.packagingUnit}`,
  ].filter(Boolean) as string[];

  return (
    <main className="max-h-[92vh] overflow-y-auto bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-foreground/10 bg-background/95 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Product</p>
            <h1 className="text-lg font-semibold text-foreground">{product.name}</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full border border-foreground/10 bg-background px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Back
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-[28px] border border-foreground/15 bg-background shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="p-4 sm:p-6 xl:sticky xl:top-0 xl:self-start">
              <div className="rounded-[24px] border border-foreground/10 bg-foreground/[0.025] p-3 sm:p-4">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-foreground/[0.04]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${safeVariant.sku || safeVariant.finish}-${gallery[activeImg]?.publicId || gallery[activeImg]?.url}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={gallery[activeImg]?.url || FALLBACK_IMG}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
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
                {safeVariant.sku && (
                  <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[10px] font-mono text-foreground/45">
                    SKU: {safeVariant.sku}
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
                      <span className="text-2xl font-black text-foreground">₹{safeVariant.discountPrice}</span>
                      <span className="text-sm text-foreground/35 line-through">₹{safeVariant.price}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30">
                        {Math.round(((safeVariant.price! - safeVariant.discountPrice!) / safeVariant.price!) * 100)}% off
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
                      const isActive = finish === safeVariant.finish;
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
                          sizeLabel === `${safeVariant.size?.value ?? ""}${safeVariant.size?.unit || "mm"}`
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

              {safeVariant.isAvailable === false && (
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
      </div>
    </main>
  );
}

export default function ProductPage() {
  const params = useParams<{ slug?: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${API_URL}/products/${slug}`)
      .then((res) => {
        const data = res.data?.data || res.data;
        setProduct(data);
        setSelectedVariant(data?.variants?.[0] || null);
      })
      .catch(() => {
        setError("Unable to load this product right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8">
          <div className="h-6 w-40 rounded bg-foreground/10" />
          <div className="mt-4 h-10 w-3/4 rounded bg-foreground/10" />
          <div className="mt-6 h-64 rounded-2xl bg-foreground/10" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8 text-center">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="mt-3 text-sm text-foreground/60">The product you requested could not be loaded.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <ProductDetailContent
      product={product}
      variant={selectedVariant}
      onSelectVariant={setSelectedVariant}
      onClose={() => router.back()}
    />
  );
}
