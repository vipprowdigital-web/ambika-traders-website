// components/FeaturedProducts.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ProductVariant {
  sku?: string;
  finish: string;
  size: { value: number; unit: "mm" | "inch" | "cm" };
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  images: { url: string; publicId: string }[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category?: { name: string; slug: string };
  images: { url: string; publicId: string }[];
  variants: ProductVariant[];
  isFeatured?: boolean;
}

function InquiryButton({ productName }: { productName: string }) {
  const message = encodeURIComponent(`Hello! I would like to inquire about ${productName}.`);
  return (
    <a
      href={`https://wa.me/9174654434?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="block w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold
                 hover:bg-primary-hover transition-colors duration-200"
    >
      📩 Send Inquiry
    </a>
  );
}

export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then((res) => {
        const all: Product[] = res.data.data || [];
        const featured = all.filter((p) => p.isFeatured);
        const nonFeatured = all.filter((p) => !p.isFeatured);
        const combined = [...featured, ...nonFeatured].slice(0, 6);
        setProducts(combined);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Featured Products</span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Most Popular Products</h2>
          <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
            Top-selling items that our customers love and trust
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
                <div className="aspect-square bg-foreground/8" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-foreground/8 rounded w-3/4" />
                  <div className="h-3 bg-foreground/8 rounded w-1/2" />
                  <div className="h-9 bg-foreground/8 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
            Unable to load products right now.
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
            No products available yet.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {products.map((product) => {
              const prices = product.variants?.map((v) => v.discountPrice || v.price || 0) || [];
              const minPrice = prices.length ? Math.min(...prices.filter((p) => p > 0)) : 0;

              return (
                <div
                  key={product._id}
                  onClick={() => router.push(`/products?highlight=${product.slug}`)}
                  className="group bg-background border border-foreground/10 rounded-2xl overflow-hidden
                             hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                >
                  <div className="bg-foreground/[0.03] aspect-square flex items-center justify-center border-b border-foreground/5 relative overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-sm text-foreground/20">No Image</span>
                    )}
                    {product.category?.name && (
                      <span className="absolute top-3 left-3 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-foreground/50 text-xs mb-4 line-clamp-1">
                      {minPrice > 0 ? `From ₹${minPrice}` : product.description}
                    </p>
                    <div className="mt-auto">
                      <InquiryButton productName={product.name} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}





// // components/FeaturedProducts.tsx



// // ==========================================
// // COMMENTED DYNAMIC VERSION (FIXED SYNTAX)
// // ==========================================

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// interface ProductVariant {
//   sku?: string;
//   finish: string;
//   size: { value: number; unit: "mm" | "inch" | "cm" };
//   price?: number;
//   discountPrice?: number;
//   isAvailable?: boolean;
//   images: { url: string; publicId: string }[];
// }

// interface DynamicProduct {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   category?: { name: string; slug: string };
//   images: { url: string; publicId: string }[];
//   variants: ProductVariant[];
//   isFeatured?: boolean;
// }

// function DynamicInquiryButton({ productName }: { productName: string }) {
//   const message = encodeURIComponent(
//     `Hello! I would like to inquire about ${productName}.`
//   );
//   const whatsappUrl = `https://wa.me/9174654434?text=${message}`;

//   return (
//     <a
//       href={whatsappUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       onClick={(e) => e.stopPropagation()}
//       className="block w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors duration-200"
//     >
//       📩 Send Inquiry
//     </a>
//   );
// }

// export function DynamicFeaturedProducts() {
//   const router = useRouter();
//   const [products, setProducts] = useState<DynamicProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${API}/products`)
//       .then((res) => {
//         const all: DynamicProduct[] = res.data.data || [];
//         const featured = all.filter((p) => p.isFeatured);
//         const nonFeatured = all.filter((p) => !p.isFeatured);
//         const combined = [...featured, ...nonFeatured].slice(0, 6);
//         setProducts(combined);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError(true);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <section className="py-16 bg-background">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//             <span className="text-primary text-sm font-semibold uppercase tracking-widest">
//               Featured Products
//             </span>
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
//             Our Most Popular Products
//           </h2>
//           <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
//             Top-selling items that our customers love and trust
//           </p>
//         </div>

//         {/* Loading state */}
//         {loading && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
//                 <div className="aspect-square bg-foreground/8" />
//                 <div className="p-4 space-y-2">
//                   <div className="h-3 bg-foreground/8 rounded w-3/4" />
//                   <div className="h-3 bg-foreground/8 rounded w-1/2" />
//                   <div className="h-9 bg-foreground/8 rounded-xl mt-3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error state */}
//         {!loading && error && (
//           <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
//             Unable to load products right now.
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && products.length === 0 && (
//           <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
//             No products available yet.
//           </div>
//         )}

//         {/* Products Grid */}
//         {!loading && !error && products.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
//             {products.map((product) => {
//               const prices = product.variants?.map((v) => v.discountPrice || v.price || 0) || [];
//               const minPrice = prices.length ? Math.min(...prices.filter((p) => p > 0)) : 0;

//               return (
//                 <div
//                   key={product._id}
//                   onClick={() => router.push(`/products?highlight=${product.slug}`)}
//                   className="group bg-background border border-foreground/10 rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
//                 >
//                   {/* Image Area */}
//                   <div className="bg-foreground/[0.03] aspect-square flex items-center justify-center border-b border-foreground/5 relative overflow-hidden">
//                     {product.images?.[0]?.url ? (
//                       <Image
//                         src={product.images[0].url}
//                         alt={product.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                         sizes="(max-width: 640px) 50vw, 33vw"
//                       />
//                     ) : (
//                       <span className="text-4xl text-foreground/15">No Image</span>
//                     )}

//                     {/* Category Tag */}
//                     {product.category?.name && (
//                       <span className="absolute top-3 left-3 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
//                         {product.category.name}
//                       </span>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className="p-4 flex flex-col flex-1">
//                     <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
//                       {product.name}
//                     </h3>
//                     <p className="text-foreground/50 text-xs mb-4 line-clamp-1">
//                       {minPrice > 0 ? `From ₹${minPrice}` : product.description}
//                     </p>
//                     <div className="mt-auto">
//                       <DynamicInquiryButton productName={product.name} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* View All CTA */}
//         <div className="text-center mt-10">
//           <Link
//             href="/products"
//             className="inline-block px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
//           >
//             View All Products →
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


// // components/FeaturedProducts.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// interface ProductVariant {
//   sku?: string;
//   finish: string;
//   size: { value: number; unit: "mm" | "inch" | "cm" };
//   price?: number;
//   discountPrice?: number;
//   isAvailable?: boolean;
//   images: { url: string; publicId: string }[];
// }

// interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   category?: { name: string; slug: string };
//   images: { url: string; publicId: string }[];
//   variants: ProductVariant[];
//   isFeatured?: boolean;
// }

// function InquiryButton({ productName }: { productName: string }) {
//   const message = encodeURIComponent(
//     `Hello! I would like to inquire about ${productName}.`
//   );
//   const whatsappUrl = `https://wa.me/9174654434?text=${message}`;

//   return (
//     <a
//       href={whatsappUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       onClick={(e) => e.stopPropagation()}
//       className="block w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold
//                  hover:bg-primary-hover transition-colors duration-200"
//     >
//       📩 Send Inquiry
//     </a>
//   );
// }

// export default function FeaturedProducts() {
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${API}/products`)
//       .then((res) => {
//         const all: Product[] = res.data.data || [];
//         const featured = all.filter((p) => p.isFeatured);
//         const nonFeatured = all.filter((p) => !p.isFeatured);
//         const combined = [...featured, ...nonFeatured].slice(0, 6);
//         setProducts(combined);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError(true);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <section className="py-16 bg-background">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//             <span className="text-primary text-sm font-semibold uppercase tracking-widest">
//               Featured Products
//             </span>
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
//             Our Most Popular Products
//           </h2>
//           <p className="text-foreground/60 mt-3 max-w-xl mx-auto">
//             Top-selling items that our customers love and trust
//           </p>
//         </div>

//         {/* Loading state */}
//         {loading && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
//                 <div className="aspect-square bg-foreground/8" />
//                 <div className="p-4 space-y-2">
//                   <div className="h-3 bg-foreground/8 rounded w-3/4" />
//                   <div className="h-3 bg-foreground/8 rounded w-1/2" />
//                   <div className="h-9 bg-foreground/8 rounded-xl mt-3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error state */}
//         {!loading && error && (
//           <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
//             Unable to load products right now.
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && products.length === 0 && (
//           <div className="py-16 text-center border border-dashed border-foreground/15 rounded-2xl text-foreground/40 text-sm">
//             No products available yet.
//           </div>
//         )}

//         {/* Products Grid */}
//         {!loading && !error && products.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
//             {products.map((product) => {
//               const prices = product.variants?.map((v) => v.discountPrice || v.price || 0) || [];
//               const minPrice = prices.length ? Math.min(...prices.filter((p) => p > 0)) : 0;

//               return (
//                 <div
//                   key={product._id}
//                   onClick={() => router.push(`/products?highlight=${product.slug}`)}
//                   className="group bg-background border border-foreground/10 rounded-2xl overflow-hidden
//                              hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
//                 >
//                   {/* Image Area */}
//                   <div className="bg-foreground/[0.03] aspect-square flex items-center justify-center border-b border-foreground/5 relative overflow-hidden">
//                     {product.images?.[0]?.url ? (
//                       <Image
//                         src={product.images[0].url}
//                         alt={product.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                         sizes="(max-width: 640px) 50vw, 33vw"
//                       />
//                     ) : (
//                       <span className="text-4xl text-foreground/15">No Image</span>
//                     )}

//                     {/* Category Tag */}
//                     {product.category?.name && (
//                       <span className="absolute top-3 left-3 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
//                         {product.category.name}
//                       </span>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className="p-4 flex flex-col flex-1">
//                     <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
//                       {product.name}
//                     </h3>
//                     <p className="text-foreground/50 text-xs mb-4 line-clamp-1">
//                       {minPrice > 0 ? `From ₹${minPrice}` : product.description}
//                     </p>
//                     <div className="mt-auto">
//                       <InquiryButton productName={product.name} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* View All CTA */}
//         <div className="text-center mt-10">
//           <Link
//             href="/products"
//             className="inline-block px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
//           >
//             View All Products →
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
