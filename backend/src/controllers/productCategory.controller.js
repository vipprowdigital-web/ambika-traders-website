import {
  uploadToCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinaryService.js";
import ProductCategory from "../models/productCategory.model.js";

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existingCategory = await ProductCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    // Initialize an empty image object
    let imageData = { url: "", publicId: "" };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.path || req.file.buffer,
        "ambikaTraders/categories",
      );
      imageData = {
        url: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id, // Capturing the public_id from Cloudinary's response
      };
    }

    const newCategory = new ProductCategory({
      name,
      description,
      image: imageData,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories (Supports Pagination & Search)
// @route   GET /api/categories
// @access  Public
const getAllProductCategories = async (req, res) => {
  try {
    // 1. Extract query params with fallback defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // 2. Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 3. Build the search query object
    const query = {};

    // If a search term is provided, filter by category name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 4. Fetch total count matching the query conditions for pagination stats
    const total = await ProductCategory.countDocuments(query);

    // 5. Fetch paginated data
    const categories = await ProductCategory.find(query)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);

    // 6. Return response matching your exact reference architecture
    return res.status(200).json({
      success: true,
      message: "Product Categories fetched successfully.",
      data: categories,
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

// @desc    Get single category by Slug or ID
// @route   GET /api/categories/:slugOrId
// @access  Public
const getProductCategoryBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const query = slugOrId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: slugOrId }
      : { slug: slugOrId };

    const category = await ProductCategory.findOne(query);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Product Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    let category = await ProductCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Product Category not found" });
    }

    // Retain existing image data by default
    let imageData = { ...category.image };

    if (req.file) {
      // 1. Delete the old image using the cleanly stored publicId
      if (category.image && category.image.publicId) {
        await destroyFromCloudinary(category.image.publicId);
      }

      // 2. Upload the new image
      const uploadResult = await uploadToCloudinary(
        req.file.path || req.file.buffer,
        "ambikaTraders/categories",
      );
      imageData = {
        url: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id,
      };
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = imageData;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Product Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Clean deletion without string parsing
    if (category.image && category.image.publicId) {
      await destroyFromCloudinary(category.image.publicId);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Category and its assets deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createProductCategory,
  getAllProductCategories,
  getProductCategoryBySlugOrId,
  updateProductCategory,
  deleteProductCategory,
};
