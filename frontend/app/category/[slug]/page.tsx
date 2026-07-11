"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";

interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url?: string };
  children?: ProductCategory[];
  parentCategory?: { _id: string; name: string; slug: string } | null;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: { url?: string }[];
  variants?: { price?: number; discountPrice?: number }[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Subcategory card (icon-style, like the reference "Door Handles / Door Hinges" grid) ──
// ── Subcategory card ─────────────────────────────────────────────────────────
function SubCategoryCard({ cat }: { cat: ProductCategory }) {
  return (
    <Link
  href={`/category/${cat.slug}`}
  className="group rounded-2xl border border-gray-200 bg-white hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden"
>
  <div className="aspect-square overflow-hidden">
    <img
      src={cat.image?.url}
      alt={cat.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <div className="p-4">
    <h3 className="text-center font-medium">{cat.name}</h3>
  </div>
</Link>
  );
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.discountPrice ?? firstVariant?.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-2xl border border-foreground/10 bg-background overflow-hidden
                 hover:border-primary hover:shadow-lg transition-all duration-300 block"
    >
      <div className="aspect-square w-full overflow-hidden bg-foreground/5">
        {product.images?.[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/30">
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        {price !== undefined && (
          <p className="text-sm font-semibold text-primary mt-1">₹{price}</p>
        )}
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");

    axios
      .get(`${API}/product-categories/${slug}`)
      .then(async (res) => {
        const cat: ProductCategory = res.data.data;
        setCategory(cat);

        // Leaf category (no children) → fetch its products directly.
        // Parent category (has children) → we just show the subcategory
        // grid below, no product fetch needed here.
        if (!cat.children || cat.children.length === 0) {
          const prodRes = await axios.get(`${API}/products`, {
            params: { category: cat._id },
          });
          setProducts(prodRes.data.data || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load category:", err);
        setError("Could not load this category right now.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-foreground/10 rounded animate-pulse mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-foreground/10 h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !category) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/50">
          {error || "Category not found."}
        </div>
      </section>
    );
  }

  const isParent = category.children && category.children.length > 0;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-foreground/50 mb-6 flex flex-wrap gap-1 items-center">
          <Link href="/" className="hover:text-primary">Home</Link>
          {category.parentCategory && (
            <>
              <span className="mx-1">/</span>
              <Link href={`/category/${category.parentCategory.slug}`} className="hover:text-primary">
                {category.parentCategory.name}
              </Link>
            </>
          )}
          <span className="mx-1">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{category.name}</h1>
          {category.description && (
            <p className="text-foreground/60 mt-2 max-w-2xl">{category.description}</p>
          )}
        </div>

        {isParent ? (
          // ── PARENT: show subcategory grid ──────────────────────────────
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {category.children!.map((child) => (
              <SubCategoryCard key={child._id} cat={child} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-foreground/50 py-10">
            No products found in this category yet.
          </p>
        ) : (
          // ── LEAF: show products grid ────────────────────────────────────
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
