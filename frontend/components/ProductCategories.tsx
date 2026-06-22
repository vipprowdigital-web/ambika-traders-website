// components/ProductCategories.tsx

// components/ProductCategories.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    _id: "1",
    name: "Cabinet Handles",
    slug: "cabinet-handles",
    description: "Premium pulls and handles for kitchen cabinets, wardrobes and furniture",
    image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "2",
    name: "Door Handle",
    slug: "door-handle",
    description: "Lever and pull handles for main doors, interior doors and office doors",
    image: { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "3",
    name: "Knob",
    slug: "knob",
    description: "Round and decorative knobs for cabinets, drawers and cupboards",
    image: { url: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "4",
    name: "Kadi",
    slug: "kadi",
    description: "Traditional kadi hooks and brackets for doors and windows",
    image: { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "5",
    name: "Conceal Handle",
    slug: "conceal-handle",
    description: "Flush recessed handles for sliding doors and modern minimalist cabinets",
    image: { url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=400&auto=format&fit=crop" },
  },
 
  {
    _id: "7",
    name: "Hangers",
    slug: "hangers",
    description: "Wall and door hangers for wardrobe, bathroom and utility areas",
    image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "8",
    name: "Door Magnets",
    slug: "door-magnets",
    description: "Magnetic door stoppers and catches for smooth and silent door closing",
    image: { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "9",
    name: "Cabinet Locks",
    slug: "cabinet-locks",
    description: "Secure locking systems for cabinets, lockers and storage units",
    image: { url: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "10",
    name: "Hinges",
    slug: "hinges",
    description: "Butt hinges, concealed hinges and heavy duty hinges for all door types",
    image: { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "11",
    name: "Glass Items",
    slug: "glass-items",
    description: "Glass fittings, clamps, hinges and hardware for glass doors and partitions",
    image: { url: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "12",
    name: "Towerbolt",
    slug: "towerbolt",
    description: "Tower bolts and barrel bolts for doors, gates and windows in all sizes",
    image: { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "13",
    name: "Sofa Legs",
    slug: "sofa-legs",
    description: "Furniture legs in wood, metal and chrome finish for sofas and tables",
    image: { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "14",
    name: "Curtain Brackets",
    slug: "curtain-brackets",
    description: "Wall mount curtain rod brackets and supports for all rod sizes",
    image: { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop" },
  },
  {
    _id: "15",
    name: "Door Kits and Aldrop",
    slug: "door-kits-and-aldrop",
    description: "Complete door fitting kits and aldrops for wooden and metal doors",
    image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop" },
  },
];

const PER_PAGE = 8;

export default function ProductCategories() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(CATEGORIES.length / PER_PAGE));
  const visibleCategories = CATEGORIES.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="py-16 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Our Categories
            </span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need, All in One Place
          </h2>
          <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
            From construction groundwork to interior finishing — we stock it all
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleCategories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group bg-background border border-foreground/10 rounded-2xl overflow-hidden
                         hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer block"
            >
              {/* Image */}
              <div className="relative w-full h-36 overflow-hidden bg-foreground/5">
                <img
                  src={cat.image.url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-xs text-foreground/50 leading-snug line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-sm rounded transition-colors ${
                  n === page
                    ? "bg-primary text-white"
                    : "border border-foreground/10 hover:border-primary"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";

// interface ProductCategory {
//   _id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   image?: { url?: string };
// }

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
// const PER_PAGE = 8;

// export default function ProductCategories() {
//   const [categories, setCategories] = useState<ProductCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     axios
//       .get(`${API}/product-categories`)
//       .then((res) => setCategories(res.data.data || []))
//       .catch((err) => {
//         console.error("Failed to load categories:", err);
//         setError("Could not load categories right now.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const totalPages = Math.max(1, Math.ceil(categories.length / PER_PAGE));
//   const visibleCategories = categories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <section className="py-16 bg-foreground/[0.02]">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//             <span className="text-primary text-sm font-semibold uppercase tracking-widest">
//               Our Categories
//             </span>
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
//             Everything You Need, All in One Place
//           </h2>
//           <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
//             From construction groundwork to interior finishing — we stock it all
//           </p>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="bg-background border border-foreground/10 rounded-2xl p-5 h-32 animate-pulse" />
//             ))}
//           </div>
//         ) : error ? (
//           <p className="text-center text-foreground/50">{error}</p>
//         ) : categories.length === 0 ? (
//           <p className="text-center text-foreground/50">No categories added yet.</p>
//         ) : (
//           <>
//             {/* Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//               {visibleCategories.map((cat) => (
//                 <Link
//                   key={cat._id}
//                   href={`/category/${cat.slug}`}
//                   className="group bg-background border border-foreground/10 rounded-2xl p-5 text-center
//                              hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer block"
//                 >
//                   {/* Icon / Image */}
//                   <div className="flex items-center justify-center mb-3">
//                     {cat.image?.url ? (
//                       // eslint-disable-next-line @next/next/no-img-element
//                       <img
//                         src={cat.image.url}
//                         alt={cat.name}
//                         className="w-full h-50 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold transition-transform duration-300 group-hover:scale-110">
//                         {cat.name.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>

//                   {/* Title */}
//                   <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-200">
//                     {cat.name}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-xs text-foreground/50 leading-snug line-clamp-2">
//                     {cat.description || "Quality products for every need"}
//                   </p>
//                 </Link>
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-10">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => setPage(n)}
//                     className={`w-8 h-8 text-sm rounded transition-colors ${
//                       n === page
//                         ? "bg-primary text-white"
//                         : "border border-foreground/10 hover:border-primary"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="px-3 py-1.5 text-sm rounded border border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// }