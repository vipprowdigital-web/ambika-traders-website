"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function RequestQuoteForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    category: "power-tools",
    quantity: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/contact`, {
        type: "General",
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: `Quote Request — ${formData.category}`,
        message: formData.message,
        meta: {
          companyName: formData.companyName,
          category: formData.category,
          quantity: formData.quantity,
        },
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 bg-background text-foreground px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-5">✅</div>
          <h2 className="text-2xl font-black text-foreground mb-3">Quote Request Sent!</h2>
          <p className="text-foreground/55 text-sm leading-relaxed mb-6">
            We have received your request. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: "", companyName: "", email: "", phone: "", category: "power-tools", quantity: "", message: "" }); }}
            className="text-primary text-sm font-bold underline underline-offset-4"
          >
            Submit another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background text-foreground px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-foreground/[0.02] border border-foreground/10 p-8 sm:p-12 rounded-3xl shadow-xs">

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Bulk Orders & B2B
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
            Request a <span className="text-primary">Custom Quote</span>
          </h2>
          <p className="text-foreground/60 text-sm mt-2 max-w-xl">
            Planning a big project or need materials in bulk? Fill out the form below and our hardware experts will get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Full Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Company Name (Optional)</label>
              <input
                type="text"
                placeholder="ABC Constructions"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Email Address *</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Primary Requirement *</label>
              <select
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
               <option value="door-handles">Door Handles</option>
<option value="main-door-locks">Main Door Locks</option>
<option value="mortise-handles-locks">Mortise Handles & Locks</option>
<option value="cabinet-handles">Cabinet Handles</option>
<option value="drawer-systems-channels">Drawer Systems & Channels</option>
<option value="hinges">Hinges</option>
<option value="door-closers">Door Closers</option>
<option value="wardrobe-accessories">Wardrobe Accessories</option>
<option value="curtain-accessories">Curtain Accessories</option>
<option value="glass-hardware">Glass Hardware</option>
<option value="bathroom-accessories">Bathroom Accessories</option>
<option value="furniture-fittings">Furniture Fittings</option>
<option value="kitchen-hardware">Kitchen Hardware</option>
<option value="architectural-hardware">Architectural Hardware</option>
<option value="complete-hardware-solution">Complete Hardware Solution</option>
<option value="other">Others / Multiple Products</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Estimated Quantity *</label>
              <input
                type="text"
                required
                placeholder="e.g., 50 units / 200 kgs"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Describe Your Requirements *</label>
            <textarea
              required
              rows={4}
              placeholder="Please list specific model numbers, sizes, brands, or custom specifications..."
              className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          {/* Submit */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-4 rounded-xl text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Quote Request"
              )}
            </button>
          </motion.div>

        </form>
      </div>
    </section>
  );
}
