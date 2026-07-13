// components/InquiryForm.tsx
"use client";

import { useState } from "react";

export default function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", product: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your actual form submission logic (EmailJS, API route, etc.)
    const msg = encodeURIComponent(
      `Hello! I'd like a quote.\n\nName: ${form.name}\nPhone: ${form.phone}\nProduct: ${form.product}\nMessage: ${form.message}`
    );
   window.open(`https://wa.me/9174654434?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-foreground/[0.02] relative overflow-hidden">

      {/* Diagonal background accent */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--primary-color) 0%, transparent 50%)",
          opacity: 0.04,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Get a Quote</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-3 mb-6 leading-tight">
              Tell Us What <br />
              <span className="text-primary">You Need.</span>
            </h2>
            <p className="text-foreground/60 text-base leading-relaxed mb-10">
              Fill in the form and we'll get back to you with the best price — usually within the hour.
              Bulk orders welcome.
            </p>

            {/* Promise strips */}
            <div className="space-y-3">
              {[
                { icon: "", text: "Response within 1 hour" },
                { icon: "", text: "No hidden charges — transparent pricing" },
                { icon: "", text: "Bulk discounts available" },
              ].map((p) => (
                <div key={p.text} className="flex items-center gap-3 text-foreground/70">
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-sm font-medium">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="bg-primary/10 border border-primary/30 rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Request Sent!</h3>
                <p className="text-foreground/60">We'll reach out on WhatsApp shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-primary text-sm font-semibold underline underline-offset-4"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rajesh Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-background border border-foreground/15
                                 text-foreground placeholder-foreground/30 text-sm
                                 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-background border border-foreground/15
                                 text-foreground placeholder-foreground/30 text-sm
                                 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-2">
                    Product Requirement
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bosch Drill Machine, PVC Pipes 4 inch..."
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border border-foreground/15
                               text-foreground placeholder-foreground/30 text-sm
                               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                               transition-all duration-200"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-2">
                    Additional Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Quantity needed, project type, delivery location, any special requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border border-foreground/15
                               text-foreground placeholder-foreground/30 text-sm resize-none
                               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                               transition-all duration-200"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white text-base
                             transition-all duration-200 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, var(--primary-color), var(--primary-hover))" }}
                >
                  Get Free Quote via WhatsApp →
                </button>

                <p className="text-center text-foreground/35 text-xs">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
