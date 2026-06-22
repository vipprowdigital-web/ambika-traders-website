"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Brand {
  name: string;
  domain: string;
  localLogo?: string;
  category: string;
}

const brands: Brand[] = [
  { name: "Bosch",        domain: "bosch.com",         category: "Power Tools" },
  { name: "Stanley",      domain: "stanleytools.com",  category: "Hand Tools" },
  { name: "Makita",       domain: "makita.com",        category: "Power Tools" },
  { name: "Asian Paints", domain: "asianpaints.com",   category: "Paints" },
  { name: "Finolex",      domain: "finolex.com",       category: "Pipes & Cables" },
  { name: "Godrej",       domain: "godrej.com",        category: "Locks & Security" },
  { name: "Havells",      domain: "havells.com",       category: "Electrical" },
  { name: "Pidilite",     domain: "pidilite.com",      category: "Adhesives" },
];

interface BrandLogoProps {
  brand: Brand;
}

function BrandLogo({ brand }: BrandLogoProps): React.ReactElement {
  const [hasError, setHasError] = useState<boolean>(false);
  const initials: string = brand.name.substring(0, 2).toUpperCase();
  const logoUrl: string = "https://www.google.com/s2/favicons?domain=" + brand.domain + "&sz=256";

  function handleError(): void {
    setHasError(true);
  }

  if (hasError) {
    return (
      <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center bg-foreground/5 text-foreground/40 text-sm font-semibold">
        {initials}
      </div>
    );
  }

  return (
    <div className="mx-auto mb-3 flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <Image
        src={logoUrl}
        alt={brand.name + " logo"}
        width={80}
        height={80}
        className="object-contain"
        onError={handleError}
        unoptimized
      />
    </div>
  );
}

export default function BrandsWeDeal(): React.ReactElement {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Trusted Brands
            </span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Brands We Trust & Stock
          </h2>
          <p className="text-foreground/60 mt-3 max-w-lg mx-auto">
            World-class and India-trusted brands — all available under one roof
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {brands.map((brand: Brand): React.ReactElement => (
            <div
              key={brand.name}
              className="group bg-background border border-foreground/10 rounded-2xl p-5 text-center hover:border-primary hover:shadow-md transition-all duration-300"
            >
              <BrandLogo brand={brand} />
              <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-foreground/50 text-xs mt-0.5">{brand.category}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-foreground/40 text-sm mt-8">
          + 50 more brands available in-store
        </p>
      </div>
    </section>
  );
}

// // components/BrandsWeDeal.tsx
// // For brand logos: place images in /public/images/brands/ folder
// // If no logo is available, the emoji fallback cards will be shown (as below)

// const brands = [
//   {
//     name: "Bosch",
//     category: "Power Tools",
//     // logo: "/images/brands/bosch.png",  // Uncomment when you have the logo
//     emoji: "⚙️",
//     color: "#005691",
//   },
//   {
//     name: "Stanley",
//     category: "Hand Tools",
//     // logo: "/images/brands/stanley.png",
//     emoji: "🔧",
//     color: "#FFB300",
//   },
//   {
//     name: "Makita",
//     category: "Power Tools",
//     // logo: "/images/brands/makita.png",
//     emoji: "🔨",
//     color: "#00A4E0",
//   },
//   {
//     name: "Asian Paints",
//     category: "Paints",
//     // logo: "/images/brands/asian-paints.png",
//     emoji: "🎨",
//     color: "#E42529",
//   },
//   {
//     name: "Finolex",
//     category: "Pipes & Cables",
//     // logo: "/images/brands/finolex.png",
//     emoji: "🚰",
//     color: "#003A8C",
//   },
//   {
//     name: "Godrej",
//     category: "Locks & Security",
//     // logo: "/images/brands/godrej.png",
//     emoji: "🔐",
//     color: "#E31E24",
//   },
//   {
//     name: "Havells",
//     category: "Electrical",
//     // logo: "/images/brands/havells.png",
//     emoji: "⚡",
//     color: "#E31E24",
//   },
//   {
//     name: "Pidilite",
//     category: "Adhesives",
//     // logo: "/images/brands/pidilite.png",
//     emoji: "🧴",
//     color: "#003399",
//   },
// ];

// export default function BrandsWeDeal() {
//   return (
//     <section className="py-16 bg-background">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//             <span className="text-primary text-sm font-semibold uppercase tracking-widest">
//               Trusted Brands
//             </span>
//             <span className="w-10 h-[3px] bg-primary rounded-full" />
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
//             Brands We Trust & Stock
//           </h2>
//           <p className="text-foreground/60 mt-3 max-w-lg mx-auto">
//             World-class and India-trusted brands — all available under one roof
//           </p>
//         </div>

//         {/* Brands Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
//           {brands.map((brand) => (
//             <div
//               key={brand.name}
//               className="group bg-background border border-foreground/10 rounded-2xl p-5 text-center
//                          hover:border-primary hover:shadow-md transition-all duration-300"
//             >
//               {/*
//                 When you have actual logos, replace the emoji block below with:
//                 <div className="h-14 relative mb-3">
//                   <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
//                 </div>
//               */}
//               <div
//                 className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
//                 style={{ backgroundColor: brand.color + "1A" }}
//               >
//                 <span>{brand.emoji}</span>
//               </div>

//               <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
//                 {brand.name}
//               </h3>
//               <p className="text-foreground/50 text-xs mt-0.5">{brand.category}</p>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Note */}
//         <p className="text-center text-foreground/40 text-sm mt-8">
//           + 50 more brands available in-store
//         </p>
//       </div>
//     </section>
//   );
// }
