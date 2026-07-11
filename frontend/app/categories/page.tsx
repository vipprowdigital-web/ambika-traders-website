// app/categories/page.tsx
// All categories listing page — clicking a category goes to /category/[slug]
// Shows ONLY parent (top-level) categories — subcategories are reached by
// clicking through a parent, same as the homepage section.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import type { Category } from "@/types/hardware";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      // "grouped" returns only top-level (parent) categories, each with its
      // children nested inside — we only render the parents here.
      .get(`${API_URL}/product-categories/grouped`)
      .then((res) => {
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <CategoriesSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── PAGE HEADER ── */}
      <section className="relative pt-20 pb-14 overflow-hidden border-b border-foreground/8">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #52525b 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Browse</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: "clamp(32px, 5vw, 58px)" }}>
              All Categories
            </h1>
            <p className="text-foreground/45 text-sm max-w-xs leading-relaxed">
              {categories.length} categories — tap any to explore products
            </p>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <div className="py-24 text-center text-foreground/30 text-sm border border-dashed border-foreground/15 rounded-2xl">
              No categories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link href={`/category/${cat.slug}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden border border-foreground/10 group-hover:border-primary/30 group-hover:shadow-xl transition-all duration-300">

                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-foreground/5 overflow-hidden">
                        <Image
                          src={cat.image?.url || "https://images.unsplash.com/photo-1634926360833-8a6fd76f0300?q=80&w=800"}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Category name on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h2 className="text-white font-black text-xl leading-tight">{cat.name}</h2>
                          {cat.description && (
                            <p className="text-white/65 text-xs mt-1 line-clamp-1">{cat.description}</p>
                          )}
                        </div>

                        {/* Arrow badge — top right */}
                        <div
                          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                        >
                          <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>

                      {/* Bottom strip */}
                      <div className="px-5 py-3.5 flex items-center justify-between bg-background border-t border-foreground/8">
                        <span className="text-foreground/50 text-xs font-semibold uppercase tracking-widest">
                          {/* @ts-ignore — children may not be typed on Category, but grouped endpoint includes it */}
                          {cat.children?.length ? `${cat.children.length} subcategories` : "View Products"}
                        </span>
                        <svg
                          className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform duration-200"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CategoriesSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-20 pb-14 border-b border-foreground/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-24 bg-foreground/10 rounded mb-4 animate-pulse" />
          <div className="h-12 w-64 bg-foreground/10 rounded animate-pulse" />
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-foreground/10 animate-pulse">
                <div className="aspect-[4/3] bg-foreground/8" />
                <div className="p-4 flex gap-3">
                  <div className="h-4 flex-1 bg-foreground/8 rounded" />
                  <div className="h-4 w-16 bg-foreground/8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-foreground/60 text-sm">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
