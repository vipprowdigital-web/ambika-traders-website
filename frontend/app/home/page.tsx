"use client";

import { motion } from "framer-motion";

const tickerItems = [
  "Power Tools", "Plumbing", "Electrical", "Fasteners",
  "Paints", "Construction", "Hand Tools", "Door Hardware",
];

export default function HeroSection() {
  const repeated = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="bg-background text-foreground">
      <section
        className="w-full h-screen flex flex-col overflow-hidden"
        style={{ position: "relative" }}
      >

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source
            src="https://res.cloudinary.com/dl6fjer3y/video/upload/v1783342212/Untitled_design_y3vkmb.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "transparent",
            zIndex: 1,
          }}
        />

        {/* ── TICKER — top ── */}
        <div
          className="border-b border-white/10 bg-black/30 backdrop-blur-sm py-2.5 overflow-hidden flex-shrink-0"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div
            className="flex gap-10 whitespace-nowrap"
            style={{ animation: "ticker 20s linear infinite" }}
          >
            {repeated.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-10">
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{item}</span>
                <span className="text-primary text-xs">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── CENTER CONTENT ── */}
        {/* <div
          className="flex-1 flex items-center justify-center px-4"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">

            <motion.span
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="block text-primary font-bold uppercase tracking-widest text-sm"
            >
              Premium Hardware Showroom — Jabalpur
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white font-black tracking-tight uppercase leading-[1.0]"
              style={{ fontSize: "clamp(42px, 8vw, 92px)" }}
            >
              Your Ultimate <br />
              Hardware <br />
              <span
                style={{
                  WebkitTextStroke: "2px #ffffff",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Destination.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium"
            >
              High-grade tools, industrial machinery, premium fittings —
              all genuine, all in stock. Trusted by Jabalpur&apos;s builders since 2011.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center justify-center gap-4 flex-wrap pt-2"
            >
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-white text-sm uppercase tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explore Store
              </a>

              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-black text-sm uppercase tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  boxShadow: "0 8px 28px rgba(245,158,11,0.35)",
                }}
              >
                Get Free Quote
              </a>
            </motion.div>

          </div>
        </div> */}

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "7rem",
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />

      </section>
    </div>
  );
}