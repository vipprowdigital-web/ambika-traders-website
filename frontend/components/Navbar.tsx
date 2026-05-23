"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white text-black font-sans sticky top-0 z-50">
      {/* 1. Top Utility Bar */}
      <div className="w-full bg-zinc-50 border-b border-zinc-100 py-2 px-4 sm:px-6 lg:px-8 text-xs flex justify-between items-center text-zinc-600">
        <div>
          <span>
            Customer Support: <strong>1-800-555-HARDWARE</strong>
          </span>
          <span className="hidden md:inline ml-4 border-l border-zinc-300 pl-4">
            Mon - Fri: 8am - 6pm EST
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/specifications"
            className="hover:text-black transition-colors"
          >
            Technical Specs
          </Link>
          <Link href="/catalog" className="hover:text-black transition-colors">
            Request Catalog
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Find a Showroom
          </Link>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-black tracking-tight uppercase">
                Brisco
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 -mt-1">
                Architectural Hardware
              </span>
            </Link>
          </div>

          {/* Search Bar (Crucial for hardware sites to lookup part numbers/finishes) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, finishes (e.g., Satin Brass, Matte Black)..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors text-black placeholder-zinc-400"
              />
              <span className="absolute right-3 top-2.5 text-zinc-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {/* Category Dropdown: Door Hardware */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("door")}
                className="flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-black transition-all"
              >
                Products
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === "door" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === "door" && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl rounded py-2 grid grid-cols-1">
                  <Link
                    href="/door-hardware/levers"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Door Levers
                  </Link>
                  <Link
                    href="/door-hardware/knobs"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Door Knobs
                  </Link>
                  <Link
                    href="/door-hardware/deadbolts"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Deadbolts & Locks
                  </Link>
                  <Link
                    href="/door-hardware/hinges"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Heavy Duty Hinges
                  </Link>
                  <Link
                    href="/door-hardware/accessories"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Stops & Accessories
                  </Link>
                </div>
              )}
            </div>

            {/* Category Dropdown: Cabinet & Kitchen */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("cabinet")}
                className="flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-black transition-all"
              >
                Cabinet & Pulls
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === "cabinet" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === "cabinet" && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl rounded py-2 grid grid-cols-1">
                  <Link
                    href="/cabinet-hardware/cabinet-pulls"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Cabinet Pulls
                  </Link>
                  <Link
                    href="/cabinet-hardware/cabinet-knobs"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Cabinet Knobs
                  </Link>
                  <Link
                    href="/cabinet-hardware/drawer-slides"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Drawer Slides
                  </Link>
                  <Link
                    href="/cabinet-hardware/latches"
                    className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black"
                  >
                    Catches & Latches
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/finishes"
              className="py-2 border-b-2 border-transparent hover:border-black transition-all"
            >
              Finishes & Materials
            </Link>
            <Link
              href="/projects"
              className="py-2 border-b-2 border-transparent hover:border-black transition-all"
            >
              Commercial Projects
            </Link>
            <Link
              href="/about"
              className="py-2 border-b-2 border-transparent hover:border-black transition-all"
            >
              Our Story
            </Link>
          </nav>

          {/* Right Section: Trade Account / Contact CTA (Instead of a store cart) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/trade-program"
              className="text-sm font-medium hover:underline"
            >
              Trade Portal
            </Link>
            <Link
              href="/quote"
              className="bg-black text-white px-5 py-2.5 rounded text-sm font-medium tracking-wide hover:bg-zinc-800 transition-colors"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Responsive Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-inner">
          {/* Mobile Search */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none text-black"
            />
          </div>

          <div className="font-semibold text-xs uppercase tracking-wider text-zinc-400 pt-2">
            Collections
          </div>
          <Link
            href="/door-hardware"
            className="block px-2 py-1 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
          >
            Door Hardware
          </Link>
          <Link
            href="/cabinet-hardware"
            className="block px-2 py-1 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
          >
            Cabinet & Pulls
          </Link>
          <Link
            href="/finishes"
            className="block px-2 py-1 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
          >
            Finishes & Materials
          </Link>
          <Link
            href="/projects"
            className="block px-2 py-1 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
          >
            Commercial Projects
          </Link>

          <div className="border-t border-zinc-100 my-2 pt-2"></div>

          <Link
            href="/trade-program"
            className="block px-2 py-1 text-base font-medium text-zinc-700"
          >
            Trade Portal
          </Link>
          <Link
            href="/quote"
            className="block w-full text-center bg-black text-white mt-2 py-2.5 rounded font-medium text-sm"
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
