"use client";

import {
  Store,
  Settings,
  Truck,
  Building2,
  Boxes,
  Trophy,
} from "lucide-react";

const milestones = [
  {
    year: "2001",
    title: "The First Shop",
    desc: "Opened a 200 sq ft shop in Napier Town hardware market with a small inventory of hand tools and fasteners. Just one employee — the owner himself.",
    icon: Store,
  },
  {
    year: "2012",
    title: "Expanding the Range",
    desc: "Added power tools and plumbing products. Became an authorized dealer for Bosch and Finolex. Shop expanded to 600 sq ft.",
    icon: Settings,
  },
  {
    year: "2015",
    title: "Serving Contractors",
    desc: "Started bulk supply for construction contractors across Jabalpur. Launched same-day delivery for B2B clients.",
    icon: Truck,
  },
  {
    year: "2018",
    title: "New Showroom",
    desc: "Moved to a 2,000 sq ft dedicated showroom with a full display of door hardware, electrical fittings, and paint accessories.",
    icon: Building2,
  },
  {
    year: "2021",
    title: "1,000+ Products",
    desc: "Crossed 1,000 SKUs in stock. Added Havells, Stanley, Asian Paints, and Godrej to the brand lineup.",
    icon: Boxes,
  },
  {
    year: "2024",
    title: "5,000+ Customers Served",
    desc: "Reached 5,000+ happy customers. Now the most-referred hardware store in Jabalpur with a 4.9-star rating.",
    icon: Trophy,
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
              Timeline
            </span>
          </div>

          <h2
            className="font-black text-foreground leading-tight tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            25 Years of Growth
          </h2>
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
                  key={m.year}
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