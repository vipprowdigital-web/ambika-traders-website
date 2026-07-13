"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 14,
    suffix: "+",
    label: "Years of Excellence",
    desc: "Delivering premium architectural hardware since 2011.",
  },
  {
    value: 4,
    suffix: "",
    label: "Products at Launch",
    desc: "Our journey began with four carefully selected hardware products.",
  },
  {
    value: 500,
    suffix: "+",
    label: "Product Categories",
    desc: "A complete range of architectural hardware solutions.",
  },
  {
    value: 1,
    suffix: "",
    label: "Quality First Philosophy",
    desc: "One unwavering commitment that drives every BRISCO® product.",
  },
];

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function StatCard({
  stat,
  active,
  index,
}: {
  stat: (typeof stats)[0];
  active: boolean;
  index: number;
}) {
  const count = useCountUp(stat.value, 1800, active);

  const formatted =
    stat.value >= 1000
      ? count >= 1000
        ? `${(count / 1000).toFixed(1)}K`
        : count
      : count;

  return (
    <div className="relative group text-center">
      {/* Vertical Divider */}
      {index > 0 && (
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20" />
      )}

      <div className="px-6 py-4 flex flex-col items-center justify-center">
        {/* Number */}
        <div className="text-5xl sm:text-6xl font-black text-white mb-3 tabular-nums group-hover:scale-105 transition-transform duration-300">
          {formatted}
          {stat.suffix}
        </div>

        {/* Label */}
        <div className="text-white font-semibold text-base mb-2">
          {stat.label}
        </div>

        {/* Description */}
        <div className="text-white/60 text-xs leading-relaxed max-w-[180px]">
          {stat.desc}
        </div>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #71717a 0%, #52525b 35%, #3f3f46 70%, #18181b 100%)",
      }}
    >
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)",
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
           BRISCO at a Glance 
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-white">
           Built on Quality. Driven by Innovation.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              active={active}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}