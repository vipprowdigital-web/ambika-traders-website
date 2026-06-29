


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
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const PER_PAGE = 8;

export default function ProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${API}/product-categories`)
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setError("Could not load categories right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(categories.length / PER_PAGE));
  const visibleCategories = categories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-background border border-foreground/10 rounded-2xl p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-foreground/50">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-foreground/50">No categories added yet.</p>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="group bg-background border border-foreground/10 rounded-2xl p-5 text-center
                             hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer block"
                >
                  {/* Icon / Image */}
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

                  {/* Title */}
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-200">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-foreground/50 leading-snug line-clamp-2">
                    {cat.description || "Quality products for every need"}
                  </p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 text-sm rounded transition-colors ${
                      n === page
                        ? "bg-primary text-white"
                        : "border border-foreground/10 hover:border-primary"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}