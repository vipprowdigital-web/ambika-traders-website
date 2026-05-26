// app/features/products/data/productApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/auth";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductVariant {
  _id?: string;
  sku?: string;
  finish: string;
  size: {
    value: number;
    unit: "mm" | "inch" | "cm";
  };
  price?: number;
  discountPrice?: number;
  isAvailable: boolean;
  images: ProductImage[];
}

export interface ProductSpecifications {
  material: string;
  mechanism?: string;
  weightCapacity?: string;
  packagingUnit?: string;
  includedComponents?: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: { _id: string; name: string } | string;
  images: ProductImage[];
  specifications: ProductSpecifications;
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

// ── API Slice ──────────────────────────────────────────────────────────────

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    // ─── Get all products (paginated + searchable) ───────────────────────
    getProducts: builder.query<
      PaginatedProductsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `products?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Product"],
    }),

    // ─── Get single product by ID ────────────────────────────────────────
    getProductById: builder.query<SingleProductResponse, string>({
      query: (id) => `products/${id}`,
      providesTags: ["Product"],
    }),

    // ─── Create product (multipart/form-data, mirrors createGallery) ─────
    createProduct: builder.mutation<SingleProductResponse, FormData>({
      query: (formData) => ({
        url: `products`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // ─── Update product (PUT) ────────────────────────────────────────────
    updateProduct: builder.mutation<
      SingleProductResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // ─── Partial update — used for toggling isActive / isFeatured ────────
    partiallyUpdateProduct: builder.mutation<
      SingleProductResponse,
      { id: string; data: Partial<Pick<Product, "isActive" | "isFeatured">> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // ─── Delete product ───────────────────────────────────────────────────
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  usePartiallyUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
