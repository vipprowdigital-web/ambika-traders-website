"use client";

import {
  ShieldCheck,
  Gem,
  Cog,
  Sparkles,
  Boxes,
  Handshake,
} from "lucide-react";

const achievements = [
  {
    icon: ShieldCheck,
    title: "Quality First Philosophy",
    body: "Quality is at the heart of everything we do. Every BRISCO® product is manufactured using premium materials, precision engineering, and rigorous quality control standards.",
    tag: "Core Value",
  },
  {
    icon: Gem,
    title: "Premium Craftsmanship",
    body: "Designed with exceptional attention to detail, our hardware products combine durability, elegance, and superior finishing for modern architectural spaces.",
    tag: "Craftsmanship",
  },
  {
    icon: Cog,
    title: "Precision Engineering",
    body: "Every product is engineered for smooth performance, long-lasting reliability, and everyday functionality without compromising aesthetics.",
    tag: "Engineering",
  },
  {
    icon: Sparkles,
    title: "Elegant Designs",
    body: "Our collections are thoughtfully designed to complement contemporary residential, commercial, and luxury interior projects.",
    tag: "Design",
  },
  {
    icon: Boxes,
    title: "Complete Hardware Solutions",
    body: "From door handles and locks to hinges, wardrobe accessories, curtain fittings, drawer hardware, and more, BRISCO® offers a comprehensive architectural hardware portfolio.",
    tag: "Collection",
  },
  {
    icon: Handshake,
    title: "Trusted by Professionals",
    body: "Architects, interior designers, builders, dealers, and homeowners trust BRISCO® for products that deliver consistent quality, reliability, and lasting performance.",
    tag: "Trust",
  },
];

export default function AchievementsSection() {
  return (
    <section className="py-20 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">
              Why BRISCO
            </span>
          </div>

          <h2
            className="font-black text-foreground leading-tight tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Built on Quality. Trusted for Performance.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => {
            const Icon = a.icon;

            return (
              <div
                key={a.title}
                className="group relative rounded-2xl border border-foreground/10 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-5">

                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={28} strokeWidth={2} />
                  </div>

                  {/* Tag */}
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    {a.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-black leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                  {a.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-foreground/60">
                  {a.body}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}