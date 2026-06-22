// components/StatsCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Years of Experience", icon: "🏆", desc: "Serving Jabalpur since 2009" },
  { value: 5000, suffix: "+", label: "Happy Customers", icon: "😊", desc: "Across Jabalpur & nearby areas" },
  { value: 1000, suffix: "+", label: "Products in Stock", icon: "📦", desc: "Always ready for your order" },
  { value: 50, suffix: "+", label: "Trusted Brands", icon: "✅", desc: "Only genuine, certified products" },
];

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ stat, active, index }: { stat: typeof stats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.value, 1800, active);
  const formatted = stat.value >= 1000 ? (count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count) : count;

  return (
    <div className="relative group text-center">
      {/* Vertical divider except first */}
      {index > 0 && (
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20" />
      )}

      <div className="px-6 py-2">
        <div className="text-4xl mb-3">{stat.icon}</div>
        <div className="text-5xl font-black text-white mb-1 tabular-nums">
          {formatted}{stat.suffix}
        </div>
        <div className="text-white font-semibold text-base mb-1">{stat.label}</div>
        <div className="text-white/60 text-xs">{stat.desc}</div>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 100%)" }}
    >
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)`
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            By The Numbers
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Our Track Record Speaks
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} active={active} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
