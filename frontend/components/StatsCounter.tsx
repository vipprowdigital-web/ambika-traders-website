"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats: {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}[] = [
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

// Ease-out cubic for a heavier, more mechanical deceleration than a linear tick-up
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="stat-plate group relative"
    >
      {/* Rivets */}
      <span className="rivet rivet-tl" />
      <span className="rivet rivet-tr" />
      <span className="rivet rivet-bl" />
      <span className="rivet rivet-br" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-8">
        <div className="relative text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tight">
          {formatted}
          <span className="text-zinc-300">{stat.suffix}</span>
        </div>

        <div className="mt-4 mb-2 flex items-center gap-2">
          <span className="h-px w-4 bg-zinc-400/50 transition-all duration-500 group-hover:w-8 group-hover:bg-zinc-300" />
          <span className="text-white font-semibold text-[13px] uppercase tracking-[0.12em]">
            {stat.label}
          </span>
        </div>

        <div className="text-white/50 text-xs leading-relaxed max-w-[190px]">
          {stat.desc}
        </div>
      </div>

      {/* Divider for large screens */}
      {index > 0 && <span className="plate-divider" />}
    </motion.div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (inView) setActive(true);
  }, [inView]);

  return (
    <section ref={ref} className="stats-section relative overflow-hidden py-24">
      {/* Base gunmetal gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #3f3f46 0%, #27272a 40%, #19191c 75%, #101012 100%)",
        }}
      />

      {/* Brushed steel texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)",
        }}
      />

      {/* Animated light sweep */}
      <div className="light-sweep pointer-events-none absolute inset-0" />

      {/* Ambient glows */}
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-zinc-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-zinc-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 border border-zinc-400/30 bg-white/5 text-zinc-200 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5">
            <span className="h-1 w-1 rounded-full bg-zinc-300" />
            BRISCO at a Glance
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Built on Quality.{" "}
            <span className="bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 bg-clip-text text-transparent">
              Driven by Innovation.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} active={active} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats-section {
          isolation: isolate;
        }

        .light-sweep {
          background: linear-gradient(
            100deg,
            transparent 0%,
            transparent 40%,
            rgba(212, 212, 216, 0.05) 48%,
            rgba(212, 212, 216, 0.09) 50%,
            rgba(212, 212, 216, 0.05) 52%,
            transparent 60%,
            transparent 100%
          );
          background-size: 250% 250%;
          animation: sweep 9s ease-in-out infinite;
        }

        @keyframes sweep {
          0% {
            background-position: 120% 0%;
          }
          50% {
            background-position: -20% 100%;
          }
          100% {
            background-position: 120% 0%;
          }
        }

        .stat-plate {
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.015) 100%
          );
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          transition: border-color 0.4s ease, transform 0.4s ease,
            box-shadow 0.4s ease;
        }

        .stat-plate:hover {
          border-color: rgba(212, 212, 216, 0.4);
          transform: translateY(-4px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 12px 28px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(212, 212, 216, 0.12);
        }

        .rivet {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 35%,
            rgba(255, 255, 255, 0.5),
            rgba(0, 0, 0, 0.4)
          );
          opacity: 0.5;
          transition: opacity 0.4s ease;
        }

        .stat-plate:hover .rivet {
          opacity: 0.9;
        }

        .rivet-tl {
          top: 8px;
          left: 8px;
        }
        .rivet-tr {
          top: 8px;
          right: 8px;
        }
        .rivet-bl {
          bottom: 8px;
          left: 8px;
        }
        .rivet-br {
          bottom: 8px;
          right: 8px;
        }

        .plate-divider {
          display: none;
        }

        @media (min-width: 1024px) {
          .plate-divider {
            display: block;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 64%;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(212, 212, 216, 0.3),
              transparent
            );
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .light-sweep {
            animation: none;
          }
          .stat-plate {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
