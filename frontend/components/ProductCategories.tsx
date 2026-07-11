"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url?: string };
  children?: ProductCategory[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function ParentCategoryCard({ cat }: { cat: ProductCategory }) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-foreground/10
                 bg-background hover:border-primary hover:shadow-lg
                 transition-all duration-300 cursor-pointer block"
    >
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-foreground/5">
        {cat.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image.url}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/40">
            {cat.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="p-4 text-center">
        <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors duration-200 uppercase tracking-wide">
          {cat.name}
        </h3>
        {cat.description && (
          <p className="text-xs text-foreground/50 leading-snug line-clamp-2 mt-1">
            {cat.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function ProductCategories() {
  const [parents, setParents] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      // "grouped" already returns top-level categories with their children
      // nested — we only need the top-level list here, children come into
      // play on the category detail page.
      .get(`${API}/product-categories/grouped`)
      .then((res) => setParents(res.data.data || []))
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-foreground/10" />
                <div className="p-4">
                  <div className="h-4 w-2/3 mx-auto bg-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-foreground/50">{error}</p>
        ) : parents.length === 0 ? (
          <p className="text-center text-foreground/50">No categories added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {parents.map((parent) => (
              <ParentCategoryCard key={parent._id} cat={parent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
