"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Mosaic span pattern cycles for visual variety
const SPAN_PATTERN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
];

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  description?: string;
}

export default function ProjectGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/gallery/active`)
      .then((res) => setItems(res.data.data || []))
      .catch((err) => console.error("Failed to load gallery:", err))
      .finally(() => setLoading(false));
  }, []);

  // Don't render section at all if no items and not loading
  if (!loading && items.length === 0) return null;

  return (
    <section className="py-20 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Gallery</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">
              Inside Our <br />
              <span className="text-primary italic">Store & Beyond</span>
            </h2>
          </div>
          <p className="text-foreground/50 text-sm max-w-xs leading-relaxed">
            A glimpse of our showroom, warehouse, product displays, and delivery operations.
          </p>
        </div>

        {/* Mosaic Grid */}
        {loading ? (
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[520px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`${SPAN_PATTERN[i]} rounded-2xl bg-foreground/8 animate-pulse`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[520px]">
            {items.slice(0, 6).map((item, i) => (
              <div
                key={item._id}
                className={`${SPAN_PATTERN[i % SPAN_PATTERN.length]} relative rounded-2xl overflow-hidden border border-foreground/10 group cursor-pointer`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1200px) 33vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <span className="text-white text-base font-bold block drop-shadow-md sm:text-sm md:text-base">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
