"use client";

import {
  Lightbulb,
  Package,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";

const milestones = [
  {
    year: "2011",
    title: "The Vision Begins",
    desc: "BRISCO® was founded with a singular vision—to redefine architectural hardware by delivering products that combine exceptional craftsmanship, uncompromising quality, enduring durability, and timeless elegance.",
    icon: Lightbulb,
  },
  {
    year: "2011",
    title: "Our First Collection",
    desc: "The journey began with four carefully selected products: Telescopic Channels, Auto Hinges, Door Catchers, and Cabinet Handles. These products laid the foundation for what would become a trusted hardware brand.",
    icon: Package,
  },
  {
    year: "2014+",
    title: "Innovation & Expansion",
    desc: "Driven by continuous innovation, BRISCO® expanded its portfolio with premium door handles, locks, hinges, curtain accessories, wardrobe fittings, drawer hardware, brass accessories, and complete architectural hardware solutions.",
    icon: Sparkles,
  },
  {
    year: "Today",
    title: "Trusted Across India",
    desc: "Today, BRISCO® is trusted by architects, interior designers, builders, dealers, and homeowners for products that seamlessly combine innovation, reliability, refined aesthetics, and exceptional durability.",
    icon: ShieldCheck,
  },
  {
    year: "Future",
    title: "Building the Future",
    desc: "With our unwavering 'Quality First' philosophy, BRISCO® continues to innovate and deliver world-class architectural hardware solutions that are crafted with precision, engineered for performance, designed for elegance, and built to last.",
    icon: Building2,
  },
];

export default function OurJourney() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">
              Our Journey
            </span>
          </div>

          <h2
            className="font-black text-foreground leading-tight tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Our Journey Since 2011
          </h2>

          <p className="mt-5 max-w-3xl text-foreground/60 text-lg leading-relaxed">
            Since 2011, BRISCO® has been redefining architectural hardware with
            precision engineering, premium craftsmanship, and an unwavering
            commitment to quality. What began with four essential products has
            evolved into a trusted brand offering complete hardware solutions
            for modern residential and commercial spaces.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-foreground/10 hidden sm:block" />

          <div>
            {milestones.map((m, i) => {
              const Icon = m.icon;

              return (
                <div
                  key={`${m.year}-${i}`}
                  className="relative grid grid-cols-1 sm:grid-cols-[104px_1fr] group"
                >
                  {/* Timeline Dot */}
                  <div className="hidden sm:flex flex-col items-center pt-8">
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-background z-10 group-hover:bg-primary transition-colors duration-300" />
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-0 sm:ml-6 pb-12 ${
                      i === milestones.length - 1 ? "pb-0" : ""
                    }`}
                  >
                    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                          <Icon size={28} strokeWidth={2} />
                        </div>

                        {/* Title */}
                        <div>
                          <div className="text-primary text-xs font-black uppercase tracking-widest">
                            {m.year}
                          </div>

                          <h3 className="text-xl font-black text-foreground">
                            {m.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-foreground/60 text-sm leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}