// components/ContactLocation.tsx
// Replace coordinates and details with your actual store info

const contactDetails = [
  {
   
    label: "Visit Us",
    value: " 709, Marhatal,  Coffee House Road, Jabalpur Napier Town",
    href: "https://maps.google.com/?q=Jabalpur+Hardware+Market",
    linkText: "Get Directions →",
  },
  {
   
    label: "Call Us",
    value: "+91 8718918781\n+91 91234 56789",
    href: "tel:+918718918781",
    linkText: "Call Now →",
  },
  {
   
    label: "WhatsApp",
    value: "+91 98765 43210\nChat anytime 9 AM – 8 PM",
    href: "https://wa.me/919876543210",
    linkText: "Message Us →",
  },
  {
    
    label: "Email",
    value: "briscojbp@gmail.com ",
    href: "mailto:briscojbp@gmail.com ",
    linkText: "Send Email →",
  },
];

const hours = [
  { day: "Monday – Saturday", time: "9:00 AM – 8:00 PM" },
  { day: "Sunday", time: "10:00 AM – 5:00 PM" },
  { day: "Public Holidays", time: "Closed" },
];

export default function ContactLocation() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Contact & Location</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-2">
            Find Us, <span className="text-primary italic">Reach Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Map + Hours — takes 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Map embed */}
            {/* Map embed */}
<div className="rounded-3xl overflow-hidden border border-foreground/10 h-72 bg-foreground/5 relative">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14672.308945656134!2d79.9324537!3d23.1673898!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae604bbdb66d%3A0x6d9f7ef951b14a9!2sNapier%20Town%2C%20Jabalpur%2C%20Madhya%20Pradesh%20482001!5e0!3m2!1sen!2sin!4v1721000000000!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="relative z-10" // Taki map placeholder text ke upar dikhe
  />
</div>

            {/* Store hours */}
            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <span></span> Store Hours
              </h3>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-foreground/60">{h.day}</span>
                    <span className={`font-semibold ${h.time === "Closed" ? "text-red-400" : "text-primary"}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact cards — takes 2 cols */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {contactDetails.map((c) => (
              <div
                key={c.label}
                className="group rounded-2xl border border-foreground/10 bg-foreground/[0.02]
                           hover:border-primary hover:bg-primary/5 transition-all duration-300 p-5"
              >
                <div className="flex items-start gap-4">
                  
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">{c.label}</p>
                    <p className="text-foreground text-sm font-medium whitespace-pre-line leading-relaxed mb-2">
                      {c.value}
                    </p>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-bold hover:underline underline-offset-4"
                    >
                      {c.linkText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
