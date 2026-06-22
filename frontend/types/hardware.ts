export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; publicId: string };
  description: string;
  isActive: boolean;
}

export interface ProductVariant {
  sku?: string;
  finish: string;
  size: { value: number; unit: "mm" | "inch" | "cm" };
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  images: { url: string; publicId: string }[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  images: { url: string; publicId: string }[];
  specifications: {
    material: string;
    mechanism?: string;
    weightCapacity?: string;
    packagingUnit?: string;
    includedComponents?: string[];
  };
  variants: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}