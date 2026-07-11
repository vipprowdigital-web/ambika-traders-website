"use client";

import {
  BadgeCheck,
  IndianRupee,
  PackageCheck,
  Truck,
  Wrench,
  ShieldCheck,
} from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    desc: "100% original and certified products — no duplicates, no compromises",
  },
  {
    icon: IndianRupee,
    title: "Competitive Pricing",
    desc: "Better prices than the market without sacrificing quality",
  },
  {
    icon: PackageCheck,
    title: "Bulk Order Facility",
    desc: "Special discounts available for contractors and bulk buyers",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Same-day delivery available across Jabalpur",
  },
  {
    icon: Wrench,
    title: "Expert Support",
    desc: "Technical guidance and assistance with product selection",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brands",
    desc: "Top brands like Bosch, Stanley, Makita, and Finolex always in stock",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Why Choose Us
            </span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why Customers Choose Us
          </h2>

          <p className="text-foreground/60 mt-3 max-w-lg mx-auto">
            More than just products — we are your complete hardware solution
            partner
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="group flex items-start gap-4 bg-background rounded-2xl p-5 border border-foreground/10 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon size={28} strokeWidth={2} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {reason.title}
                  </h3>

                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}