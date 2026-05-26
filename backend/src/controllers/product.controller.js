import {
  uploadToCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinaryService.js";
import Product from "../models/product.model.js";

const CLOUDINARY_FOLDER = "ambikaTraders/products";

// @desc    Create a new product with multiple image asset mappings
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      specifications,
      variants,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and category are required fields.",
      });
    }

    // Handle multiple root-level product image uploads
    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path || file.buffer, {
          folder: CLOUDINARY_FOLDER,
        }),
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Store both url and public_id from Cloudinary execution mapping
      imageObjects = uploadResults.map((result) => ({
        url: result.secure_url || result.url,
        publicId: result.public_id,
      }));
    }

    const parsedSpecifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications;
    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    const newProduct = new Product({
      name,
      description,
      category,
      images: imageObjects,
      specifications: parsedSpecifications,
      variants: parsedVariants,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products with Pagination and Query Filtering
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const categoryId = req.query.category || "";

    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categoryId) {
      query.category = categoryId;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Error",
      error: error.message,
    });
  }
};

// @desc    Get single product by Slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const query = slugOrId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: slugOrId }
      : { slug: slugOrId };

    const product = await Product.findOne(query);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a whole product record (Full Overwrite)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProductFull = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      specifications,
      variants,
      isFeatured,
      isActive,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    if (specifications) {
      product.specifications =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    }
    if (variants) {
      product.variants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    }

    // Process new replacement images if supplied
    if (req.files && req.files.length > 0) {
      // 1. Delete old images from Cloudinary directly using clean publicIds
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((img) =>
          destroyFromCloudinary(img.publicId),
        );
        await Promise.all(deletePromises).catch((err) =>
          console.log("Old asset cleanup skip:", err.message),
        );
      }

      // 2. Upload new replacement files
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path || file.buffer, {
          folder: CLOUDINARY_FOLDER,
        }),
      );
      const uploadResults = await Promise.all(uploadPromises);

      product.images = uploadResults.map((result) => ({
        url: result.secure_url || result.url,
        publicId: result.public_id,
      }));
    }

    await product.save();
    res.status(200).json({
      success: true,
      message: "Product fully updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Patch partial product fields
// @route   PATCH /api/products/:id
// @access  Private/Admin
const patchProductPartial = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.images) {
      return res.status(400).json({
        success: false,
        message: "Use PUT endpoint to modify structured image arrays.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).populate("category", "name slug");

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product target not found" });
    }

    res.status(200).json({
      success: true,
      message: "Field patched successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product profile and clean storage buckets
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product profile target not found" });
    }

    // Direct, elegant asset removal from Cloudinary without URL substring splits
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((img) =>
        destroyFromCloudinary(img.publicId),
      );
      await Promise.all(deletePromises).catch((err) =>
        console.log("Cloudinary asset removal skip:", err.message),
      );
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product and associated media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductFull,
  patchProductPartial,
  deleteProduct,
};
