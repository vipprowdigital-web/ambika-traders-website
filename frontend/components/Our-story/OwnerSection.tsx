// components/our-story/OwnerSection.tsx
// Owner ka personal intro — photo + quote + bio

import Image from "next/image";

export default function OwnerSection() {
  return (
    <section className="py-20 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT — Photo column */}
          <div className="lg:col-span-5">
            <div className="relative">

              {/* Photo frame */}
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-foreground/5 border border-foreground/10">
                
                  Replace with actual owner photo:
                  <Image src="/images/hard.png" alt="Owner Name" fill className="object-cover object-top" />
               
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/20">
                  <span className="text-8xl mb-3">👤</span>
                  <span className="text-sm font-medium">Owner Photo Here</span>
                  <span className="text-xs mt-1 opacity-60">Replace with actual photo</span>
                </div> */}

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(82,82,91,0.08), transparent)" }}
                />
              </div>

              {/* Floating experience badge */}
              <div
                className="absolute -right-5 top-10 rounded-2xl px-5 py-4 shadow-xl"
                style={{
                  background: "var(--primary-color)",
                }}
              >
                <div className="text-white font-black text-3xl leading-none">25+</div>
                <div className="text-white/80 text-xs font-semibold mt-0.5">Years in<br />Business</div>
              </div>

              {/* Bottom label */}
              <div
                className="absolute -bottom-5 left-6 right-6 rounded-2xl px-5 py-4 border border-foreground/10"
                style={{ background: "var(--background)" }}
              >
                <div className="font-black text-foreground text-lg leading-tight">Shri Ravi Daswani</div>
                <div className="text-foreground/45 text-xs font-semibold mt-0.5 uppercase tracking-widest">
                  Founder & Owner
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Bio */}
          <div className="lg:col-span-7 lg:pl-6">

            {/* Big pull quote */}
            <div className="relative mb-8">
              <span
                className="absolute -top-6 -left-2 font-black leading-none select-none text-primary"
                style={{ fontSize: "80px", opacity: 0.15 }}
              >
                "
              </span>
              <blockquote className="text-foreground font-bold text-xl sm:text-2xl leading-snug pl-2 relative z-10">
                I started this business with one goal — give every customer the same quality and honesty I would want for my own home.
              </blockquote>
            </div>

            <div className="space-y-4 text-foreground/60 text-base leading-relaxed mb-8">
              <p>
                My journey began in 2001, when I established our store at 709, Marhatal, Coffee House Road, Jabalpur. With a passion for quality hardware and a commitment to serving customers with honesty, I set out to build a business that people could trust.
              </p>
              <p>
                Over the years, our dedication to genuine products, fair pricing, and reliable service has earned us the confidence of contractors, builders, architects, and homeowners across Jabalpur. Every product we offer is carefully selected to ensure quality and value for our customers.never changed.
              </p>
              <p>
                Today, after more than two decades of serving the community, I continue to personally uphold the same values that inspired this journey from the very beginning. For me, this is more than just a business—it is a lifelong commitment to trust, quality, and customer satisfaction.
              </p>
            </div>

            {/* Signature line */}
            <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
              <div>
                {/* Replace with actual signature image if available */}
                <div className="text-foreground font-black text-2xl" style={{ fontFamily: "Georgia, serif" }}>
                  Ramesh K. Gupta
                </div>
                <div className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-0.5">
                  Founder — Est. 2001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
