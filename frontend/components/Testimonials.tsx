// components/Testimonials.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Testimonial {
  _id: string;
  name: string;
  designation?: string;
  description: string;
  avatar?: string | null;
  thumbnail?: string | null;
  rating: number;
}

// Strip HTML tags coming from rich text editor (e.g. "<p>text</p>" -> "text")
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}
function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-primary text-sm">★</span>
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-full sm:w-[340px] rounded-2xl p-6 border border-foreground/10 bg-foreground/[0.02] flex flex-col"
    >
      <StarRow count={t.rating || 5} />

      <p className="text-foreground/70 leading-relaxed mt-3 mb-5 text-sm line-clamp-4">
        {stripHtml(t.description)}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2.5 mt-auto">
        {t.avatar ? (
          <img
            src={t.avatar}
            alt={t.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-foreground/10"
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-primary">
            {getInitials(t.name)}
          </div>
        )}
        <div>
          <div className="font-bold text-foreground text-sm">{t.name}</div>
          {t.designation && (
            <div className="text-foreground/45 text-xs">{t.designation}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] =useState(0);

  useEffect(() => {
    axios
      .get(`${API}/testimonial/public`)
      .then((res) => setTestimonials(res.data.data || []))
      .catch((err) => console.error("Failed to load testimonials:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-foreground/10 bg-foreground/[0.02] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const avgRating = (
    testimonials.reduce((sum, x) => sum + (x.rating || 5), 0) / testimonials.length
  ).toFixed(1);

  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % testimonials.length);

  // Duplicate enough times for a seamless loop
  const loopList =
    testimonials.length < 6
      ? [...testimonials, ...testimonials, ...testimonials]
      : [...testimonials, ...testimonials];

  // Roughly estimate animation duration based on card count (slower with more cards)
  const duration = Math.max(6, loopList.length * 0.5);

  return (
    <section className="py-20 bg-background relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-2">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => <span key={i} className="text-primary text-xl">★</span>)}
            </div>
            <span className="text-foreground/50 text-sm">{avgRating} / 5 average rating</span>
          </div>
        </div>
      </div>

      {/* Edge fade masks — desktop only */}
      <div className="hidden sm:block pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-16 sm:w-32 h-[260px] z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="hidden sm:block pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-16 sm:w-32 h-[260px] z-10 bg-gradient-to-l from-background to-transparent" />

      {/* Continuous right-to-left marquee — desktop only */}
      <div className="hidden sm:block relative overflow-hidden">
        {mounted && (
          <div
            className="flex gap-5 w-max"
            style={{
              animation: `testimonial-marquee ${duration}s linear infinite`,
            }}
          >
            {loopList.map((t, i) => (
              <TestimonialCard key={`${t._id}-${i}`} t={t} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile: single card with prev/next buttons */}
      <div className="sm:hidden relative max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="flex-shrink-0 w-9 h-9 rounded-full border border-foreground/15 bg-background
                       flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary
                       transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <TestimonialCard t={testimonials[currentIndex]} />
          </div>

          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="flex-shrink-0 w-9 h-9 rounded-full border border-foreground/15 bg-background
                       flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary
                       transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-8 bg-primary" : "w-2 bg-foreground/15 hover:bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonial-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

