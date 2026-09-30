import Category from "../models/Category";
import { ApiError } from "../utils/apiError";
import { toSlug } from "../utils/slugify";
import { deleteImage, uploadImage } from "./cloudinaryService";

export async function listCategories(activeOnly = false) {
  const filter = activeOnly ? { isActive: true } : {};
  return Category.find(filter).sort({ name: 1 });
}

export async function getCategoryById(id: string) {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found");
  return category;
}

export async function createCategory(
  data: { name: string; description?: string },
  file?: Express.Multer.File
) {
  const slug = toSlug(data.name, false);
  const existing = await Category.findOne({ $or: [{ name: data.name }, { slug }] });
  if (existing) throw ApiError.conflict("A category with this name already exists");

  const image = file ? await uploadImage(file.buffer, "ecommerce/categories") : undefined;

  return Category.create({ ...data, slug, image });
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; description: string; isActive: boolean }>,
  file?: Express.Multer.File
) {
  const category = await getCategoryById(id);

  if (data.name && data.name !== category.name) {
    category.slug = toSlug(data.name, false);
  }

  if (file) {
    if (category.image?.publicId) await deleteImage(category.image.publicId);
    category.image = await uploadImage(file.buffer, "ecommerce/categories");
  }

  Object.assign(category, data);
  await category.save();
  return category;
}

export async function deleteCategory(id: string) {
  const category = await getCategoryById(id);
  if (category.image?.publicId) await deleteImage(category.image.publicId);
  await category.deleteOne();
}
