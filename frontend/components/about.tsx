// components/AboutUs.tsx

import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-[3px] bg-primary rounded-full" />
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            About Us
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
              Jabalpur&apos;s Most Trusted{" "}
              <span className="text-primary">Hardware & Construction</span>{" "}
              Store
            </h2>

            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              We provide high-quality hardware products, construction materials, power tools,
              plumbing solutions, and electrical accessories for both residential and
              commercial projects.
            </p>

            <p className="text-foreground/70 text-base leading-relaxed mb-8">
              With over 15 years of experience, we have earned the trust of thousands of
              customers across Jabalpur and surrounding areas. We offer genuine brands,
              competitive pricing, and expert guidance to meet all your hardware needs.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { number: "15+", label: "Years Experience" },
                { number: "500+", label: "Products" },
                { number: "10K+", label: "Happy Customers" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl border border-foreground/10 bg-foreground/[0.03]"
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-foreground/60 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Placeholder (replace with your actual store image) */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <Image src="/images/storee.png" alt="Our Store" fill className="object-cover" />
              {/* <div className="text-center text-foreground/30">
                <div className="text-6xl mb-3">🏪</div>
                <p className="text-sm">Store Image Here</p>
                <p className="text-xs mt-1">Replace with your actual store photo</p>
              </div> */}
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-5 -left-5 bg-primary text-white rounded-xl px-5 py-3 shadow-lg">
              <div className="text-xl font-bold">Since 2011</div>
              <div className="text-xs opacity-90">Serving Jabalpur</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
