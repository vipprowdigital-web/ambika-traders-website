// components/our-story/TeamSection.tsx

const team = [
  {
    name: "Ramesh Kumar Gupta",
    role: "Founder & Owner",
    since: "2009",
    specialty: "Power Tools & Construction Materials",
    desc: "15+ years in the hardware trade. Personally oversees product quality and vendor relationships.",
    initials: "RK",
  },
  {
    name: "Suresh Gupta",
    role: "Store Manager",
    since: "2013",
    specialty: "Plumbing & Electrical",
    desc: "11 years with the store. Knows every product inside out — customers trust his recommendations.",
    initials: "SG",
  },
  {
    name: "Anita Patel",
    role: "Sales & Customer Care",
    since: "2017",
    specialty: "Paint & Door Hardware",
    desc: "Our customers first point of contact. Known for patience and detailed product knowledge.",
    initials: "AP",
  },
  {
    name: "Mukesh Yadav",
    role: "Delivery & Logistics",
    since: "2015",
    specialty: "Bulk Orders & Same-Day Delivery",
    desc: "Ensures your order reaches you on time, every time. Manages our Jabalpur delivery fleet.",
    initials: "MY",
  },
];

export default function TeamSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">The People</span>
            </div>
            <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              Who You Deal With
            </h2>
          </div>
          <p className="text-foreground/50 text-sm max-w-xs leading-relaxed sm:text-right">
            Real people with real expertise — not a call centre or a chatbot.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-3xl border border-foreground/10 bg-foreground/[0.02]
                         hover:border-primary/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-1.5 w-full bg-primary" />
              <div className="p-6">
                <div className="relative mb-5">
                  {/*
                    Replace with actual photo:
                    <Image src={`/images/team/${member.initials.toLowerCase()}.jpg`} alt={member.name} width={64} height={64} className="rounded-2xl object-cover" />
                  */}
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl">
                    {member.initials}
                  </div>
                  <span className="absolute bottom-0 right-0 text-[10px] font-bold px-2 py-0.5 rounded-full border border-foreground/10 bg-background text-foreground/60">
                    Since {member.since}
                  </span>
                </div>
                <h3 className="text-foreground font-black text-base leading-tight mb-0.5">{member.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{member.role}</p>
                <p className="text-foreground/40 text-xs font-semibold mb-3">{member.specialty}</p>
                <p className="text-foreground/55 text-xs leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
