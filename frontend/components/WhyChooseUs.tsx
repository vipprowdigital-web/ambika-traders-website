// components/WhyChooseUs.tsx

const reasons = [
  {
    icon: "✅",
    title: "Genuine Products",
    desc: "100% original and certified products — no duplicates, no compromises",
  },
  {
    icon: "💰",
    title: "Competitive Pricing",
    desc: "Better prices than the market without sacrificing quality",
  },
  {
    icon: "📦",
    title: "Bulk Order Facility",
    desc: "Special discounts available for contractors and bulk buyers",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Same-day delivery available across Jabalpur",
  },
  {
    icon: "🛠️",
    title: "Expert Support",
    desc: "Technical guidance and assistance with product selection",
  },
  {
    icon: "🏆",
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
            More than just products — we are your complete hardware solution partner
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex items-start gap-4 bg-background rounded-2xl p-5 border border-foreground/10
                         hover:border-primary hover:shadow-md transition-all duration-300"
            >
              {/* Icon Circle */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                {reason.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-foreground mb-1">{reason.title}</h3>
                <p className="text-sm text-foreground/60 leading-snug">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
