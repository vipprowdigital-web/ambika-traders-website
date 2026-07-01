


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

  const CategoryCard = ({ cat }: { cat: ProductCategory }) => (
    <Link
      href={`/category/${cat.slug}`}
      className="group bg-background border border-foreground/10 rounded-2xl p-5 text-center
                 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer block"
    >
      <div className="flex items-center justify-center mb-3">
        {cat.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image.url}
            alt={cat.name}
            className="w-full h-50 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="bg-background border border-foreground/10 rounded-2xl p-5 h-32 animate-pulse" />
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

                {/* Children grid — fall back to parent card if no children */}
                {parent.children && parent.children.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {parent.children.map((child) => (
                      <CategoryCard key={child._id} cat={child} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <CategoryCard cat={parent} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}