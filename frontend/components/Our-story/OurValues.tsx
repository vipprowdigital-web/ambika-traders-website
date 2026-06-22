// components/our-story/OurValues.tsx
// Core values — what the business stands for

const values = [
  {
    icon: "🤝",
    title: "Trust Above All",
    desc: "We stock only genuine, certified products. No duplicates, no shortcuts. If we would not use it in our own home, we will not sell it in our store.",
  },
  {
    icon: "💡",
    title: "Expert Advice, Free",
    desc: "Our staff has years of hands-on experience. We do not just hand you a product — we make sure it is the right one for your job.",
  },
  {
    icon: "📐",
    title: "Right Product, Right Price",
    desc: "We believe fair pricing builds long relationships. No inflated MRPs, no hidden margins — just transparent, competitive pricing.",
  },
  {
    icon: "🏘️",
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
              <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">What We Stand For</span>
            </div>
            <h2
              className="font-black text-foreground leading-tight tracking-tight"
              style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
              Our Values
            </h2>
          </div>
          <p className="text-foreground/50 text-base leading-relaxed lg:pb-1">
            These are not slogans on a wall. They are the decisions we make every day — in every product we stock, every price we set, and every customer we serve.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="relative rounded-3xl p-8 border border-foreground/10 bg-background overflow-hidden
                         hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Large number watermark */}
              <span
                className="absolute top-4 right-6 font-black text-foreground/[0.04] leading-none select-none"
                style={{ fontSize: "96px" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="text-4xl mb-5">{v.icon}</div>
              <h3 className="text-foreground font-black text-xl mb-3 group-hover:text-primary transition-colors duration-200">
                {v.title}
              </h3>
              <p className="text-foreground/55 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
