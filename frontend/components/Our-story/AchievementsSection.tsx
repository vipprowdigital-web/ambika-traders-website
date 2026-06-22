
// components/our-story/AchievementsSection.tsx

const achievements = [
  { icon: "🏆", title: "Best Hardware Store — Jabalpur", body: "Voted by local contractors association for 3 consecutive years (2021, 2022, 2023).", tag: "Award" },
  { icon: "✅", title: "Authorized Bosch Dealer", body: "Certified authorized dealer for Bosch power tools — guaranteeing 100% genuine products and warranty support.", tag: "Certification" },
  { icon: "✅", title: "Finolex Authorized Partner", body: "Official stockist for Finolex cables and pipes with full manufacturer warranty.", tag: "Certification" },
  { icon: "⭐", title: "4.9 / 5 Google Rating", body: "Over 500 verified customer reviews — consistently rated among the top hardware stores in Madhya Pradesh.", tag: "Recognition" },
  { icon: "🤝", title: "Preferred Supplier — 50+ Contractors", body: "Trusted long-term supplier for over 50 active civil contractors, builders, and interior designers in Jabalpur.", tag: "Partnership" },
  { icon: "📦", title: "1,000+ Products in Stock", body: "One of Jabalpur's widest hardware inventories — from a single bolt to full construction material packages.", tag: "Milestone" },
];

export default function AchievementsSection() {
  return (
    <section className="py-20 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">Recognition</span>
          </div>
          <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
            Awards & Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="relative rounded-2xl p-6 border border-foreground/10 bg-background
                         hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{a.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {a.tag}
                </span>
              </div>
              <h3 className="text-foreground font-black text-base mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
                {a.title}
              </h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
