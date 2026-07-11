"use client";

import {
  Trophy,
  BadgeCheck,
  ShieldCheck,
  Star,
  Handshake,
  Boxes,
} from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Best Hardware Store — Jabalpur",
    body: "Voted by local contractors association for 3 consecutive years (2021, 2022, 2023).",
    tag: "Award",
  },
  {
    icon: BadgeCheck,
    title: "Authorized Bosch Dealer",
    body: "Certified authorized dealer for Bosch power tools — guaranteeing 100% genuine products and warranty support.",
    tag: "Certification",
  },
  {
    icon: ShieldCheck,
    title: "Finolex Authorized Partner",
    body: "Official stockist for Finolex cables and pipes with full manufacturer warranty.",
    tag: "Certification",
  },
  {
    icon: Star,
    title: "4.9 / 5 Google Rating",
    body: "Over 500 verified customer reviews — consistently rated among the top hardware stores in Madhya Pradesh.",
    tag: "Recognition",
  },
  {
    icon: Handshake,
    title: "Preferred Supplier — 50+ Contractors",
    body: "Trusted long-term supplier for over 50 active civil contractors, builders, and interior designers in Jabalpur.",
    tag: "Partnership",
  },
  {
    icon: Boxes,
    title: "1,000+ Products in Stock",
    body: "One of Jabalpur's widest hardware inventories — from a single bolt to full construction material packages.",
    tag: "Milestone",
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
              Recognition
            </span>
          </div>

          <h2
            className="font-black text-foreground leading-tight tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Awards & Certifications
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