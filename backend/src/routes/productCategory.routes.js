import express from "express";
const router = express.Router();
import {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  getProductCategoryBySlugOrId,
  updateProductCategory,
} from "../controllers/productCategory.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

// Public routes
router.get("/", getAllProductCategories);
router.get("/:slugOrId", getProductCategoryBySlugOrId);

// Admin-only protected routes
router.post("/", ensureAuth, upload.single("image"), createProductCategory);
router.put("/:id", ensureAuth, upload.single("image"), updateProductCategory);
router.delete("/:id", ensureAuth, deleteProductCategory);

export default router;
