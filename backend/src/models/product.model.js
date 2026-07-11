import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
  sku: {
    type: String,
    sparse: true,
  },
  finish: {
    type: String,
    required: true, // e.g., Brass, Matt Black, Chrome, Antique Gold
  },
  size: {
    value: {
      type: Number,
      required: true, // e.g., 96, 128, 6, 8
    },
    unit: {
      type: String,
      required: true,
      enum: ["mm", "inch", "cm"],
      default: "mm",
    },
  },

  price: {
    type: Number,
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    specifications: {
      material: { type: String, default: "" }, // e.g., Zinc Alloy, Brass
      mechanism: { type: String },
      weightCapacity: { type: String },
      packagingUnit: { type: String, default: "Piece" },
      includedComponents: [{ type: String }],
    },

    variants: [productVariantSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, // Controls if the entire product page is hidden or visible
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
