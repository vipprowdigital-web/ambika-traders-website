"use client";

import Image from "next/image";

const galleryItems = [
  { 
    label: "Store Front", 
    imgUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80", 
    span: "col-span-2 row-span-2" 
  },
  { 
    label: "Power Tools Display", 
    imgUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80", 
    span: "col-span-1 row-span-1" 
  },
  { 
    label: "Warehouse", 
    imgUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80", 
    span: "col-span-1 row-span-1" 
  },
  { 
    label: "Plumbing Section", 
    imgUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80", 
    span: "col-span-1 row-span-1" 
  },
  { 
    label: "Delivery Fleet", 
    imgUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80", 
    span: "col-span-2 row-span-1" 
  },
  { 
    label: "Electrical Products", 
    imgUrl: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80", 
    span: "col-span-1 row-span-1" 
  },
];

export default function ProjectGallery() {
  return (
    <section className="py-20 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Gallery</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-2 leading-none">
              Inside Our <br />
              <span className="text-primary italic">Store & Beyond</span>
            </h2>
          </div>
          <p className="text-foreground/50 text-sm max-w-xs leading-relaxed">
            A glimpse of our showroom, warehouse, product displays, and delivery operations.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[520px]">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`${item.span} relative rounded-2xl overflow-hidden border border-foreground/10 group cursor-pointer`}
            >
              {/* Actual Next.js Image Component */}
              <Image
                src={item.imgUrl}
                alt={item.label}
                fill
                sizes="(max-w-7xl) 33vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                priority={i < 2} // Preloads first two images for better performance
              />

              {/* Tint overlay that appears smoothly on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Permanent label subtly visible, stands out on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translation-all duration-300">
                <span className="text-white text-base font-bold block drop-shadow-md sm:text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}