"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Link } from "lucide-react";
import { Facebook, Instagram } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function Footer() {
  const year = new Date().getFullYear();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${API}/app-config/public`)
      .then((res) => {
        setConfig(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Social links array with dynamic href
  

// ... baaki sab same

const socials = [
  { label: "Facebook", href: config?.facebookLink || "#", icon: <Facebook size={16} /> },
  { label: "Instagram", href: config?.instagramLink || "#", icon: <Instagram size={16} /> },
  { label: "WhatsApp", href: config?.whatsAppLink || "#", icon: "WA" },
  { label: "Youtube", href: config?.youtubeLink || "#", icon: "YT" },
];
  // Quick Links placeholder array (Aapke purane code ki functionality bachane ke liye)
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Our Story", href: "/our-story" },
  
];
  // Categories placeholder array (Aapke purane code ki functionality bachane ke liye)
  const categories = [
    { label: "Power Tools", href: "/category/power-tools" },
    { label: "Hand Tools", href: "/category/hand-tools" },
    { label: "Plumbing", href: "/category/plumbing" },
    { label: "Electrical", href: "/category/electrical" },
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand column */}
<div className="lg:col-span-1">
  {/* Logo */}

  <Image
    src="/images/brisco.jpeg"
    alt="Brisco"
    width={180}
    height={60}
    priority
    className="w-auto h-12"
  />


  {/* Description */}
  <p className="text-background/50 text-sm leading-relaxed mb-6">
    {config?.appName ||
      "Complete Hardware Solutions with Premium Quality Products."}
  </p>

  {/* Social Icons */}
  <div className="flex items-center gap-3">
    {socials
      .filter((s) => s.href && s.href !== "#")
      .map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-white flex items-center justify-center text-background/60 transition-all duration-200"
        >
          {s.icon}
        </a>
      ))}
  </div>
</div>

          {/* Quick Links */}
          <div>
            <h4 className="text-background font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/50 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-background font-bold text-sm uppercase tracking-widest mb-5">Categories</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <a
                    href={cat.href}
                    className="text-background/50 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info - Steps 6, 7, 8, 9 */}
          <div>
            <h4 className="text-background font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: "", text: config?.companyAddress?.[0]?.address || "" },
                { icon: "", text: config?.phoneNumber || "" },
                { icon: "", text: `WhatsApp: ${config?.phoneNumber || ""}` },
                { icon: "", text: config?.email || "" },
              ].map((c, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-sm mt-0.5 flex-shrink-0">{c.icon}</span>
                  <span className="text-background/50 text-sm leading-snug">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar - Step 10 */}
      <div className="border-t border-background/10">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
    <p className="text-background/35 text-xs">
      © {year} {config?.appName || "Brisco"}. All rights reserved.
    </p>

    <p className="text-background/25 text-xs">
      Developed by{" "}
      <a
        href="https://vipprow.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-semibold"
      >
        Vipprow
      </a>
    </p>
  </div>
</div>
    </footer>
  );
}