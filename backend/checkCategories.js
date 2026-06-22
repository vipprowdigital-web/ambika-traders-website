import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductCategory from "./src/models/productCategory.model.js"; // path apne model ke hisaab se check kar lena

dotenv.config();

async function main() {
 await mongoose.connect(process.env.MONGODB_URI);
  const categories = await ProductCategory.find({}, { name: 1, isActive: 1 });
  console.log(JSON.stringify(categories, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});