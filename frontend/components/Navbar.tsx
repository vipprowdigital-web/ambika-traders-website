"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  images?: { url: string }[];
  category?: { name: string };
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`${API}/product-categories`)
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      axios
        .get(`${API}/products?search=${encodeURIComponent(query.trim())}&limit=6`)
        .then((res) => setResults(res.data.data || []))
        .catch((err) => console.error("Search failed:", err))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const goToProduct = (product: SearchProduct) => {
    setShowResults(false);
    setQuery("");
    setIsOpen(false);
    router.push(`/products?highlight=${product.slug}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowResults(false);
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white text-black font-sans sticky top-0 z-50">

      {/* Top Utility Bar */}
      {/* <div className="w-full bg-zinc-50 border-b border-zinc-100 py-2 px-4 sm:px-6 lg:px-8 text-xs flex justify-between items-center text-zinc-600">
        <div>
          <span>Customer Support: <strong>+91 12345-67089</strong></span>
          <span className="hidden md:inline ml-4 border-l border-zinc-300 pl-4">Mon - Fri: 8am - 6pm IST</span>
        </div>
        <div className="flex gap-4">
          <Link href="/specifications" className="hover:text-black transition-colors">Technical Specs</Link>
          <Link href="/catalog" className="hover:text-black transition-colors">Request Catalog</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Find a Showroom</Link>
        </div>
      </div> */}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-black tracking-tight uppercase">Brisco</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 -mt-1">Architectural Hardware</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchBoxRef}>
            <form onSubmit={submitSearch} className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                placeholder="Search products, finishes (e.g., Satin Brass, Matte Black)..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors text-black placeholder-zinc-400"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-zinc-400 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Live results dropdown */}
              {showResults && query.trim() && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-zinc-200 shadow-xl rounded z-50 max-h-96 overflow-y-auto">
                  {searching ? (
                    <div className="px-4 py-6 text-center text-zinc-400 text-sm">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-6 text-center text-zinc-400 text-sm">
                      No products found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    <>
                      {results.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => goToProduct(product)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded bg-zinc-100 flex-shrink-0 overflow-hidden">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px]">No img</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate">{product.name}</p>
                            {product.category?.name && (
                              <p className="text-xs text-zinc-400 truncate">{product.category.name}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={submitSearch}
                        className="w-full text-center px-4 py-2.5 text-xs font-semibold text-black hover:bg-zinc-50 border-t border-zinc-100 transition-colors"
                      >
                        See all results for &ldquo;{query}&rdquo; →
                      </button>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">

            {/* Categories Dropdown — dynamic from backend */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                className="flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-black transition-all"
              >
                Categories
                <svg
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl rounded py-2 z-50">
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-zinc-400 text-xs">No categories found</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link href="/products" className="py-2 border-b-2 border-transparent hover:border-black transition-all">
              Products
            </Link>
            <Link href="/our-story" className="py-2 border-b-2 border-transparent hover:border-black transition-all">
              Our Story
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/request-quote"
              className="bg-black text-white px-5 py-2.5 rounded text-sm font-medium tracking-wide hover:bg-zinc-800 transition-colors"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-4 pb-6 space-y-1 shadow-inner">
          <form onSubmit={submitSearch} className="relative w-full mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none text-black"
            />
          </form>

          {/* Mobile live results */}
          {query.trim() && (
            <div className="mb-4 border border-zinc-200 rounded max-h-72 overflow-y-auto">
              {searching ? (
                <div className="px-4 py-4 text-center text-zinc-400 text-sm">Searching...</div>
              ) : results.length === 0 ? (
                <div className="px-4 py-4 text-center text-zinc-400 text-sm">No products found</div>
              ) : (
                results.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => goToProduct(product)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-100 last:border-0"
                  >
                    <div className="w-9 h-9 rounded bg-zinc-100 flex-shrink-0 overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[9px]">No img</div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-zinc-900 truncate">{product.name}</p>
                  </button>
                ))
              )}
            </div>
          )}

          <div className="font-semibold text-xs uppercase tracking-wider text-zinc-400 pt-2 pb-1">
            Categories
          </div>

          {/* Vertical scrollable list - shows 5, scroll for more */}
          <div className="flex flex-col overflow-y-auto max-h-[200px]" style={{ scrollbarWidth: "thin" }}>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-zinc-100 my-3" />

          <Link href="/products" onClick={() => setIsOpen(false)} className="block px-2 py-2 text-base font-medium text-zinc-700">Products</Link>
          <Link href="/our-story" onClick={() => setIsOpen(false)} className="block px-2 py-2 text-base font-medium text-zinc-700">Our Story</Link>

          <Link
            href="/request-quote"
            className="block w-full text-center bg-black text-white mt-3 py-2.5 rounded font-medium text-sm"
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}




// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// interface SearchProduct {
//   _id: string;
//   name: string;
//   slug: string;
//   images?: { url: string }[];
// }

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// export default function Navbar() {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);

//   // ── Live product search ──────────────────────────────────────────
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const searchBoxRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     axios
//       .get(`${API}/product-categories`)
//       .then((res) => setCategories(res.data.data || []))
//       .catch((err) => console.error("Failed to load categories:", err));
//   }, []);

//   // Debounce: type karne ke 300ms baad hi search call jaye
//   useEffect(() => {
//     const query = searchQuery.trim();
//     if (!query) {
//       setSearchResults([]);
//       setSearchOpen(false);
//       return;
//     }

//     setSearchLoading(true);
//     const timer = setTimeout(() => {
//       axios
//         .get(`${API}/products`, { params: { search: query, limit: 6 } })
//         .then((res) => {
//           setSearchResults(res.data.data || []);
//           setSearchOpen(true);
//         })
//         .catch((err) => {
//           console.error("Search failed:", err);
//           setSearchResults([]);
//         })
//         .finally(() => setSearchLoading(false));
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Bahar click karne par dropdown band ho jaye
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
//         setSearchOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const goToProduct = (slug: string) => {
//     setSearchOpen(false);
//     setSearchQuery("");
//     setIsOpen(false);
//     router.push(`/products/${slug}`);
//   };

//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Escape") setSearchOpen(false);
//     if (e.key === "Enter" && searchResults.length > 0) goToProduct(searchResults[0].slug);
//   };

//   const SearchDropdown = ({ compact = false }: { compact?: boolean }) => {
//     if (!searchOpen || !searchQuery.trim()) return null;
//     return (
//       <div className={`${compact ? "mt-2 relative" : "absolute left-0 mt-2 z-50"} w-full bg-white border border-zinc-200 shadow-xl rounded py-2 max-h-72 overflow-y-auto`}>
//         {searchResults.length === 0 ? (
//           <p className="px-4 py-3 text-zinc-400 text-sm">
//             {searchLoading ? "Searching…" : "No products found."}
//           </p>
//         ) : (
//           searchResults.map((p) => (
//             <button
//               key={p._id}
//               onClick={() => goToProduct(p.slug)}
//               className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 text-left"
//             >
//               {p.images?.[0]?.url ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img src={p.images[0].url} alt={p.name} className="w-8 h-8 object-cover rounded border border-zinc-200" />
//               ) : (
//                 <div className="w-8 h-8 rounded bg-zinc-100 shrink-0" />
//               )}
//               <span className="text-sm text-zinc-700">{p.name}</span>
//             </button>
//           ))
//         )}
//       </div>
//     );
//   };

//   return (
//     <header className="w-full border-b border-zinc-200 bg-white text-black font-sans sticky top-0 z-50">

//       {/* Main Navbar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20 gap-4">

//           {/* Logo */}
//           <div className="shrink-0">
//             <Link href="/" className="flex flex-col">
//               <span className="text-xl font-black tracking-tight uppercase">Brisco</span>
//               <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 -mt-1">Architectural Hardware</span>
//             </Link>
//           </div>

//           {/* Search */}
//           <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchBoxRef}>
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
//                 onKeyDown={handleSearchKeyDown}
//                 placeholder="Search products, finishes (e.g., Satin Brass, Matte Black)..."
//                 className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors text-black placeholder-zinc-400"
//               />
//               <span className="absolute right-3 top-2.5 text-zinc-400">
//                 {searchLoading ? (
//                   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                 ) : (
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 )}
//               </span>
//               <SearchDropdown />
//             </div>
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">

//             {/* Categories Dropdown — dynamic from backend */}
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
//                 className="flex items-center gap-1 py-2 border-b-2 border-transparent hover:border-black transition-all"
//               >
//                 Categories
//                 <svg
//                   className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
//                   fill="none" stroke="currentColor" viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute left-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl rounded py-2 z-50">
//                   {categories.length === 0 ? (
//                     <p className="px-4 py-2 text-zinc-400 text-xs">No categories found</p>
//                   ) : (
//                     categories.map((cat) => (
//                       <Link
//                         key={cat._id}
//                         href={`/category/${cat.slug}`}
//                         className="block px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-black transition-colors"
//                       >
//                         {cat.name}
//                       </Link>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>

//             <Link href="/products" className="py-2 border-b-2 border-transparent hover:border-black transition-all">
//               Products
//             </Link>
//             <Link href="/our-story" className="py-2 border-b-2 border-transparent hover:border-black transition-all">
//               Our Story
//             </Link>
//           </nav>

//           {/* CTA */}
//           <div className="hidden lg:flex items-center gap-4">
//             <Link
//               href="/request-qoute"
//               className="bg-black text-white px-5 py-2.5 rounded text-sm font-medium tracking-wide hover:bg-zinc-800 transition-colors"
//             >
//               Request a Quote
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="lg:hidden flex items-center">
//             <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none p-2">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {isOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {isOpen && (
//         <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-4 pb-6 space-y-1 shadow-inner">
//           <div className="relative w-full mb-4" ref={searchBoxRef}>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleSearchKeyDown}
//               placeholder="Search catalog..."
//               className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none text-black"
//             />
//             <SearchDropdown compact />
//           </div>

//           <div className="font-semibold text-xs uppercase tracking-wider text-zinc-400 pt-2 pb-1">
//             Categories
//           </div>

//           {categories.map((cat) => (
//             <Link
//               key={cat._id}
//               href={`/category/${cat.slug}`}
//               onClick={() => setIsOpen(false)}
//               className="block px-2 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 rounded"
//             >
//               {cat.name}
//             </Link>
//           ))}

//           <div className="border-t border-zinc-100 my-3" />

//           <Link href="/products" onClick={() => setIsOpen(false)} className="block px-2 py-2 text-base font-medium text-zinc-700">Products</Link>
//           <Link href="/our-story" onClick={() => setIsOpen(false)} className="block px-2 py-2 text-base font-medium text-zinc-700">Our Story</Link>

//           <Link
//             href="/request-qoute"
//             className="block w-full text-center bg-black text-white mt-3 py-2.5 rounded font-medium text-sm"
//           >
//             Request a Quote
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }


