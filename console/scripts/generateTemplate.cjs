/**
 * Generates AmbikaTraders_Product_Upload_Template.xlsx
 * Run from console/: node scripts/generateTemplate.cjs
 */

const XLSX = require("xlsx");
const path = require("path");

const headers = [
  "name",
  "description",
  "parent_category",
  "category",
  "product_img1",
  "product_img2",
  "product_img3",
  "spec_material",
  "spec_mechanism",
  "spec_weightCapacity",
  "spec_packagingUnit",
  "variant_sku",
  "variant_finish",
  "variant_size_value",
  "variant_size_unit",
  "variant_price",
  "variant_discountPrice",
  "variant_img1",
  "variant_img2",
  "variant_img3",
  "variant_img4",
];

const hints = [
  "Required — product name",
  "Optional — product description",
  "Optional — parent category name e.g. Door Hardware",
  "Optional — child category name e.g. Mortise Locks (use this OR parent_category)",
  "Optional — image filename e.g. handle1.jpg",
  "Optional — image filename",
  "Optional — image filename",
  "Optional — e.g. Zinc Alloy",
  "Optional — e.g. Lever",
  "Optional — e.g. 10kg",
  "Optional — e.g. Piece",
  "Optional — e.g. SKU-001",
  "Optional — e.g. Brass (default: Standard)",
  "Optional — number e.g. 96 (default: 0)",
  "Optional — mm / inch / cm (default: mm)",
  "Optional — number e.g. 250",
  "Optional — number e.g. 199",
  "Optional — image filename",
  "Optional — image filename",
  "Optional — image filename",
  "Optional — image filename",
];

const example = [
  "Mortise Lock Premium",
  "Heavy duty mortise lock for main doors",
  "Door Hardware",
  "Mortise Locks",
  "mortise_lock_main.jpg",
  "",
  "",
  "Zinc Alloy",
  "Lever",
  "50kg",
  "Piece",
  "SKU-ML-001",
  "Antique Brass",
  "96",
  "mm",
  "850",
  "699",
  "mortise_brass_96.jpg",
  "",
  "",
  "",
];

const ws = XLSX.utils.aoa_to_sheet([headers, hints, example]);
ws["!cols"] = headers.map(() => ({ wch: 28 }));
ws["!rows"] = [{ hpt: 20 }, { hpt: 40 }, { hpt: 20 }];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "PRODUCTS");

const outPath = path.join(
  __dirname,
  "..",
  "public",
  "templates",
  "AmbikaTraders_Product_Upload_Template.xlsx"
);

XLSX.writeFile(wb, outPath);
console.log("Template written to:", outPath);
