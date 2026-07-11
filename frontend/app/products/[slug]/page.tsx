"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600";

export default function ProductDetailModal({
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
      : [{ url: FALLBACK_IMG, publicId: "fallback" }];

  const [activeImg, setActiveImg] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

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

  const selectByFinish = (finish: string) => {
    const match =
      product.variants.find((v) => v.finish === finish && v.size?.value === variant.size?.value) ||
      product.variants.find((v) => v.finish === finish);
    if (match) onSelectVariant(match);
  };

  const selectBySize = (sizeLabel: string) => {
    const match =
      product.variants.find(
        (v) => `${v.size?.value}${v.size?.unit || "mm"}` === sizeLabel && v.finish === variant.finish
      ) || product.variants.find((v) => `${v.size?.value}${v.size?.unit || "mm"}` === sizeLabel);
    if (match) onSelectVariant(match);
  };

  const highlightPoints = [
    product.specifications?.material && `Material: ${product.specifications.material}`,
    product.specifications?.mechanism && `Mechanism: ${product.specifications.mechanism}`,
    product.specifications?.weightCapacity && `Capacity: ${product.specifications.weightCapacity}`,
    product.specifications?.packagingUnit && `Packaging: ${product.specifications.packagingUnit}`,
  ].filter(Boolean) as string[];

  const DESCRIPTION_LIMIT = 220;
  const isLongDescription = (product.description?.length || 0) > DESCRIPTION_LIMIT;
  const shownDescription =
    !isLongDescription || descExpanded
      ? product.description
      : product.description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[28px] border border-foreground/15 bg-background shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-sm text-white transition-colors hover:bg-black"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="p-4 sm:p-6 xl:sticky xl:top-0 xl:self-start">
              <div className="rounded-[24px] border border-foreground/10 bg-foreground/[0.025] p-3 sm:p-4">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-foreground/[0.04]">
                  <Image
                    key={`${variant.sku || variant.finish}-${gallery[activeImg]?.publicId || gallery[activeImg]?.url}`}
                    src={gallery[activeImg]?.url || FALLBACK_IMG}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
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
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-foreground/60">
                  Premium finish • crafted for durability and everyday elegance
                </p>
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
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
                    Finish
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueFinishes.map((finish) => (
                      <button
                        key={finish}
                        onClick={() => selectByFinish(finish)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
                          finish === variant.finish
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {uniqueSizes.length > 1 && (
                <div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
                    Size
                  </span>
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
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    Key details
                  </div>
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
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    Box inclusions
                  </div>
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
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Product details
              </h3>
              <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/70">
                {product.description
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
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
