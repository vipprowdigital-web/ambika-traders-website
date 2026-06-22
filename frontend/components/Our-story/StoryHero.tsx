// components/our-story/StoryHero.tsx
// Page ka opening — owner ka bold statement, no video, just type + texture

export default function StoryHero() {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-background">

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #52525b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Amber glow top-right */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(82,82,91,0.08) 0%, transparent 65%)" }}
      />

      {/* Large faded background word */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 font-black uppercase select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(100px, 18vw, 220px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(82,82,91,0.08)",
        }}
      >
        SINCE<br />2009
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[2px] bg-primary" />
          <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">Our Story</span>
        </div>

        {/* Main headline — split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
          <div>
            <h1
              className="font-black text-foreground leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(44px, 7vw, 80px)" }}
            >
              Built on<br />
              Hard Work.<br />
              <span className="text-primary">Built to Last.</span>
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="text-foreground/55 text-lg leading-relaxed mb-6 max-w-md">
              What started as a small shop in Jabalpur&apos;s hardware market has grown into the region&apos;s most trusted destination — one tool, one customer, one promise at a time.
            </p>
            {/* Quick facts inline */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: "Founded", value: "2009" },
                { label: "Location", value: "Napier Town, Jabalpur" },
                { label: "Category", value: "Hardware & Construction" },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-foreground/35 text-[10px] font-bold uppercase tracking-widest mb-0.5">{f.label}</div>
                  <div className="text-foreground font-bold text-sm">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
