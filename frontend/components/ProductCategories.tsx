


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url?: string };
  children?: ProductCategory[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const CARD_WIDTH = 220; // px — approximate card width + gap used for scroll step

function CategoryCard({ cat }: { cat: ProductCategory }) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group flex-shrink-0 w-[200px] sm:w-[210px] bg-background border border-foreground/10
                 rounded-2xl p-5 text-center hover:border-primary hover:shadow-lg
                 transition-all duration-300 cursor-pointer block"
    >
      <div className="flex items-center justify-center mb-3">
        {cat.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image.url}
            alt={cat.name}
            className="w-16 h-16 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold transition-transform duration-300 group-hover:scale-110">
            {cat.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-200">
        {cat.name}
      </h3>
      <p className="text-xs text-foreground/50 leading-snug line-clamp-2">
        {cat.description || "Quality products for every need"}
      </p>
    </Link>
  );
}

function ChildrenScroller({ children }: { children: ProductCategory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -CARD_WIDTH * 2 : CARD_WIDTH * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/scroller">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
          w-9 h-9 rounded-full bg-background border border-foreground/15 shadow-md
          flex items-center justify-center text-foreground/60 hover:text-primary
          hover:border-primary transition-all duration-200
          ${
            canScrollLeft
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child) => (
          <CategoryCard key={child._id} cat={child} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
          w-9 h-9 rounded-full bg-background border border-foreground/15 shadow-md
          flex items-center justify-center text-foreground/60 hover:text-primary
          hover:border-primary transition-all duration-200
          ${
            canScrollRight
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProductCategories() {
  const [groups, setGroups] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/product-categories/grouped`)
      .then((res) => setGroups(res.data.data || []))
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setError("Could not load categories right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Our Categories
            </span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need, All in One Place
          </h2>
          <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
            From construction groundwork to interior finishing — we stock it all
          </p>
        </div>

        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 w-48 bg-foreground/10 rounded animate-pulse mb-4" />
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex-shrink-0 w-[200px] bg-background border border-foreground/10 rounded-2xl p-5 h-36 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-foreground/50">{error}</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-foreground/50">No categories added yet.</p>
        ) : (
          <div className="space-y-12">
            {groups.map((parent) => (
              <div key={parent._id}>
                {/* Parent heading */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  <h3 className="text-xl font-bold text-foreground">{parent.name}</h3>
                  {parent.description && (
                    <span className="text-sm text-foreground/50 hidden sm:inline">
                      — {parent.description}
                    </span>
                  )}
                </div>

                {/* Children horizontal scroll row — fall back to parent card if no children */}
                <ChildrenScroller
                  children={parent.children && parent.children.length > 0 ? parent.children : [parent]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}