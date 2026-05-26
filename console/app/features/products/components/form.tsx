// app/features/products/components/form.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageIcon,
  UploadIcon,
  XIcon,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../data/productApi";
import { Combobox } from "@/components/crud/Combobox";
import {
  useGetProductCategoriesAllQuery,
  useGetProductCategoriesQuery,
} from "~/features/product-categories/data/productCategoryApi";

// ── Types ──────────────────────────────────────────────────────────────────

// Represents one row in the variants section of the form
interface VariantFormRow {
  _id?: string; // Present when editing an existing variant
  sku: string;
  finish: string;
  sizeValue: string; // Kept as string in the form, parsed to Number on submit
  sizeUnit: "mm" | "inch" | "cm";
  price: string;
  discountPrice: string;
  isAvailable: boolean;
}

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  // Specifications
  specMaterial: string;
  specMechanism: string;
  specWeightCapacity: string;
  specPackagingUnit: string;
  // Flags
  isFeatured: boolean;
  isActive: boolean;
}

// ── Validation ─────────────────────────────────────────────────────────────

const validate = (values: FormValues, variants: VariantFormRow[]) => {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) errors.name = "Product name is required.";
  else if (values.name.length > 200)
    errors.name = "Name cannot exceed 200 characters.";

  if (!values.description.trim())
    errors.description = "Description is required.";

  if (!values.categoryId) errors.categoryId = "Please select a category.";
  if (!values.specMaterial.trim())
    errors.specMaterial = "Material is required.";

  // Validate every variant row
  variants.forEach((v, i) => {
    if (!v.finish.trim()) errors[`variant_${i}_finish`] = "Finish is required.";
    if (!v.sizeValue || isNaN(Number(v.sizeValue)))
      errors[`variant_${i}_sizeValue`] = "Valid size is required.";
    if (v.price && isNaN(Number(v.price)))
      errors[`variant_${i}_price`] = "Price must be a number.";
    if (v.discountPrice && isNaN(Number(v.discountPrice)))
      errors[`variant_${i}_discountPrice`] = "Discount price must be a number.";
    if (
      v.price &&
      v.discountPrice &&
      Number(v.discountPrice) >= Number(v.price)
    )
      errors[`variant_${i}_discountPrice`] =
        "Discount price must be less than price.";
  });

  return errors;
};

// ── Default empty variant row ──────────────────────────────────────────────

const emptyVariant = (): VariantFormRow => ({
  sku: "",
  finish: "",
  sizeValue: "",
  sizeUnit: "mm",
  price: "",
  discountPrice: "",
  isAvailable: true,
});

// ── Main Component ─────────────────────────────────────────────────────────

export default function ProductForm({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit" || !!id;

  // ── API hooks ────────────────────────────────────────────────────────────
  const { data: productData, isLoading: loadingProduct } =
    useGetProductByIdQuery(id ?? "", { skip: !isEdit });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // ── Category options ─────────────────────────────────────────────────────
  // Replace with: const { data: catData } = useGetCategoriesQuery(...)
  // const [categoryOptions, setCategoryOptions] = React.useState<
  //   { label: string; value: string }[]
  // >([]);
  const { data: catData, isLoading: loadingCategories } =
    useGetProductCategoriesAllQuery();

  // ── Local form state ─────────────────────────────────────────────────────
  const [values, setValues] = useState<FormValues>({
    name: "",
    description: "",
    categoryId: "",
    specMaterial: "",
    specMechanism: "",
    specWeightCapacity: "",
    specPackagingUnit: "Piece",
    isFeatured: false,
    isActive: true,
  });

  const [variants, setVariants] = useState<VariantFormRow[]>([emptyVariant()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Image upload — multiple product-level images ─────────────────────────
  // We use maxFiles: 5 to allow multiple images. The hook tracks each file
  // with a preview URL for the thumbnail grid.
  const [
    { files: imageFiles, isDragging: imageDrag, errors: imageErrors },
    imageHandlers,
  ] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB per image
    multiple: true,
  });

  // The existing server URLs shown when in edit mode before new files are picked
  const [existingImages, setExistingImages] = useState<
    { url: string; publicId: string }[]
  >([]);

  // ── Map raw category data to match combobox options layout ────────────────
  const categoryOptions = useMemo(() => {
    if (!catData?.data) return [];

    // Assuming backend returns an array under `data` property, alter fallback if shape matches array directly
    const list = Array.isArray(catData.data) ? catData.data : catData;
    if (!Array.isArray(list)) return [];

    return list.map((cat: any) => ({
      label: cat.name,
      value: cat._id,
    }));
  }, [catData]);

  // ── Prefill for edit mode ────────────────────────────────────────────────
  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      setValues({
        name: p.name || "",
        description: p.description || "",
        categoryId:
          typeof p.category === "object" ? p.category._id : p.category || "",
        specMaterial: p.specifications?.material || "",
        specMechanism: p.specifications?.mechanism || "",
        specWeightCapacity: p.specifications?.weightCapacity || "",
        specPackagingUnit: p.specifications?.packagingUnit || "Piece",
        isFeatured: p.isFeatured ?? false,
        isActive: p.isActive ?? true,
      });

      setExistingImages(p.images || []);

      // Map the stored variants back into the flat form shape
      if (p.variants?.length > 0) {
        setVariants(
          p.variants.map((v: any) => ({
            _id: v._id,
            sku: v.sku || "",
            finish: v.finish || "",
            sizeValue: String(v.size?.value ?? ""),
            sizeUnit: v.size?.unit || "mm",
            price: v.price != null ? String(v.price) : "",
            discountPrice:
              v.discountPrice != null ? String(v.discountPrice) : "",
            isAvailable: v.isAvailable ?? true,
          })),
        );
      }
    }
  }, [productData]);

  // ── Field change helpers ─────────────────────────────────────────────────
  const handleChange = (name: keyof FormValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormRow,
    value: any,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
    const key = `variant_${index}_${field}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);

  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (
    e: React.FormEvent,
    actionType: "create" | "create_another" = "create",
  ) => {
    e.preventDefault();

    const newErrors = validate(values, variants);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the highlighted errors.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", values.name.trim());
      formData.append("description", values.description.trim());
      formData.append("category", values.categoryId);
      formData.append("isFeatured", String(values.isFeatured));
      formData.append("isActive", String(values.isActive));

      formData.append(
        "specifications",
        JSON.stringify({
          material: values.specMaterial.trim(),
          mechanism: values.specMechanism.trim() || undefined,
          weightCapacity: values.specWeightCapacity.trim() || undefined,
          packagingUnit: values.specPackagingUnit || "Piece",
        }),
      );

      formData.append(
        "variants",
        JSON.stringify(
          variants.map((v) => ({
            ...(v._id ? { _id: v._id } : {}),
            sku: v.sku.trim() || undefined,
            finish: v.finish.trim(),
            size: { value: Number(v.sizeValue), unit: v.sizeUnit },
            price: v.price ? Number(v.price) : undefined,
            discountPrice: v.discountPrice
              ? Number(v.discountPrice)
              : undefined,
            isAvailable: v.isAvailable,
          })),
        ),
      );

      // Append newly selected images (File objects from the hook)
      for (const f of imageFiles) {
        formData.append("images", f.file as Blob);
      }

      if (isEdit) {
        if (!id) {
          toast.error("Missing product ID for update.");
          return;
        }
        await updateProduct({ id, formData }).unwrap();
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product created successfully!");

        if (actionType === "create_another") {
          // Reset form — same pattern as gallery
          setValues({
            name: "",
            description: "",
            categoryId: "",
            specMaterial: "",
            specMechanism: "",
            specWeightCapacity: "",
            specPackagingUnit: "Piece",
            isFeatured: false,
            isActive: true,
          });
          setVariants([emptyVariant()]);
          setErrors({});
          setExistingImages([]);
          imageHandlers.clearFiles?.();
          return;
        }

        navigate("/admin/products");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "❌ Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit mode loader ─────────────────────────────────────────────────────
  if (loadingProduct && isEdit) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading product details...
        </span>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 w-full mx-auto space-y-8">
      {/* Header — identical structure to gallery form */}
      <header>
        <h1 className="text-3xl font-semibold">
          {isEdit ? "Edit Product" : "Create Product"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEdit
            ? "Update existing product details below."
            : "Fill out the form to add a new product."}
        </p>
      </header>

      <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Product name, description and category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={values.name}
                    placeholder="e.g. Cabinet Handle Premium"
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    value={values.description}
                    placeholder="Describe this product..."
                    rows={4}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none ${
                      errors.description ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  {/* Wire this up to your category API query when ready.
                      Replace categoryOptions with the mapped API response. */}
                  <Combobox
                    options={categoryOptions}
                    value={values.categoryId}
                    onChange={(val) => handleChange("categoryId", val)}
                    placeholder="Select a category..."
                    width="100%"
                  />
                  {errors.categoryId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>
                  Material and physical properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">
                      Material <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={values.specMaterial}
                      placeholder="e.g. Zinc Alloy, Brass"
                      onChange={(e) =>
                        handleChange("specMaterial", e.target.value)
                      }
                      className={errors.specMaterial ? "border-red-500" : ""}
                    />
                    {errors.specMaterial && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.specMaterial}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2">Mechanism</Label>
                    <Input
                      value={values.specMechanism}
                      placeholder="e.g. Screw Fixing"
                      onChange={(e) =>
                        handleChange("specMechanism", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2">Weight Capacity</Label>
                    <Input
                      value={values.specWeightCapacity}
                      placeholder="e.g. 5 kg"
                      onChange={(e) =>
                        handleChange("specWeightCapacity", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2">Packaging Unit</Label>
                    <Select
                      value={values.specPackagingUnit}
                      onValueChange={(v) =>
                        handleChange("specPackagingUnit", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Piece", "Set", "Box", "Pair"].map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variants — dynamic rows */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Variants</CardTitle>
                    <CardDescription className="mt-1">
                      Each variant is a unique size + finish combination
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{variants.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg p-4 space-y-4 bg-muted/20"
                  >
                    {/* Variant number label + remove button */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Variant {index + 1}
                      </p>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Finish */}
                      <div>
                        <Label className="mb-1.5 text-xs">
                          Finish <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={variant.finish}
                          placeholder="e.g. Brass, Matt Black"
                          onChange={(e) =>
                            handleVariantChange(index, "finish", e.target.value)
                          }
                          className={
                            errors[`variant_${index}_finish`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`variant_${index}_finish`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`variant_${index}_finish`]}
                          </p>
                        )}
                      </div>

                      {/* SKU */}
                      <div>
                        <Label className="mb-1.5 text-xs">SKU (optional)</Label>
                        <Input
                          value={variant.sku}
                          placeholder="e.g. CBH-BRASS-96MM"
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                        />
                      </div>

                      {/* Size value + unit together */}
                      <div>
                        <Label className="mb-1.5 text-xs">
                          Size <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={variant.sizeValue}
                            placeholder="96"
                            className={`flex-1 ${
                              errors[`variant_${index}_sizeValue`]
                                ? "border-red-500"
                                : ""
                            }`}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "sizeValue",
                                e.target.value,
                              )
                            }
                          />
                          <Select
                            value={variant.sizeUnit}
                            onValueChange={(v) =>
                              handleVariantChange(index, "sizeUnit", v)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mm">mm</SelectItem>
                              <SelectItem value="inch">inch</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {errors[`variant_${index}_sizeValue`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`variant_${index}_sizeValue`]}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <Label className="mb-1.5 text-xs">Price (₹)</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          placeholder="849"
                          className={
                            errors[`variant_${index}_price`]
                              ? "border-red-500"
                              : ""
                          }
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                        />
                        {errors[`variant_${index}_price`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`variant_${index}_price`]}
                          </p>
                        )}
                      </div>

                      {/* Discount Price */}
                      <div>
                        <Label className="mb-1.5 text-xs">
                          Discount Price (₹)
                        </Label>
                        <Input
                          type="number"
                          value={variant.discountPrice}
                          placeholder="699"
                          className={
                            errors[`variant_${index}_discountPrice`]
                              ? "border-red-500"
                              : ""
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "discountPrice",
                              e.target.value,
                            )
                          }
                        />
                        {errors[`variant_${index}_discountPrice`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`variant_${index}_discountPrice`]}
                          </p>
                        )}
                      </div>

                      {/* Available toggle */}
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <Label className="text-xs">Available</Label>
                        <Switch
                          checked={variant.isAvailable}
                          onCheckedChange={(v) =>
                            handleVariantChange(index, "isAvailable", v)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={addVariant}
                >
                  <Plus className="h-4 w-4" /> Add Variant
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">
            {/* Status switches — isActive + isFeatured */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={values.isActive}
                    onCheckedChange={(v) => handleChange("isActive", v)}
                  />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={values.isFeatured}
                    onCheckedChange={(v) => handleChange("isFeatured", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product images — multiple upload, mirrors gallery image zone */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Shown on the product page across all variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Existing images (edit mode) */}
                {existingImages.length > 0 && (
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img.url}
                          alt={`Product image ${i + 1}`}
                          className="h-20 w-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New image previews from the file hook */}
                {imageFiles.length > 0 && (
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {imageFiles.map((f) => (
                      <div key={f.id} className="relative group">
                        <img
                          src={f.preview}
                          alt="New image"
                          className="h-20 w-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => imageHandlers.removeFile(f.id)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone — identical structure to gallery form */}
                <div
                  onDragEnter={imageHandlers.handleDragEnter}
                  onDragLeave={imageHandlers.handleDragLeave}
                  onDragOver={imageHandlers.handleDragOver}
                  onDrop={imageHandlers.handleDrop}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all ${
                    imageDrag ? "bg-accent border-primary" : "border-border"
                  }`}
                >
                  <input
                    {...imageHandlers.getInputProps()}
                    className="sr-only"
                    multiple
                  />
                  <div className="flex flex-col items-center text-center">
                    <ImageIcon className="h-6 w-6 opacity-70 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drop images or click to browse
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={imageHandlers.openFileDialog}
                    >
                      <UploadIcon className="h-4 w-4 mr-2" /> Select Images
                    </Button>
                  </div>
                </div>

                {imageErrors[0] && (
                  <p className="text-xs text-red-500 mt-1">{imageErrors[0]}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer buttons — exact same pattern as gallery form */}
        <div className="flex gap-3 pt-6">
          {isEdit ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, "create")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, "create_another")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  "Create & Create Another"
                )}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
