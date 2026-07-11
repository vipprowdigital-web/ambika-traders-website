"use client";

import {
  ShieldCheck,
  Lightbulb,
  BadgeDollarSign,
  Building2,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust Above All",
    desc: "We stock only genuine, certified products. No duplicates, no shortcuts. If we would not use it in our own home, we will not sell it in our store.",
  },
  {
    icon: Lightbulb,
    title: "Expert Advice, Free",
    desc: "Our staff has years of hands-on experience. We do not just hand you a product — we make sure it is the right one for your job.",
  },
  {
    icon: BadgeDollarSign,
    title: "Right Product, Right Price",
    desc: "We believe fair pricing builds long relationships. No inflated MRPs, no hidden margins — just transparent, competitive pricing.",
  },
  {
    icon: Building2,
    title: "Rooted in Jabalpur",
    desc: "This city built us. We give back through employment, local sourcing, and serving every community — from homeowners to large contractors.",
  },
];

export default function OurValues() {
  return (
    <section className="py-20 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">
                What We Stand For
              </span>
            </div>

            <h2
              className="font-black text-foreground leading-tight tracking-tight"
              style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
              Our Values
            </h2>
          </div>

          <p className="text-foreground/50 text-base leading-relaxed lg:pb-1">
            These are not slogans on a wall. They are the decisions we make
            every day — in every product we stock, every price we set, and every
            customer we serve.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;

            return (
              <div
                key={v.title}
                className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl group"
              >
                {/* Watermark Number */}
                <span
                  className="absolute top-4 right-6 font-black text-foreground/[0.04] leading-none select-none"
                  style={{ fontSize: "96px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon size={32} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-black text-foreground transition-colors duration-300 group-hover:text-primary">
                  {v.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-foreground/60">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}