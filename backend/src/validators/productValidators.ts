import { z } from "zod";

const specSchema = z.object({ key: z.string(), value: z.string() });

export const createProductSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  brand: z.string().trim().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  discountPrice: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative(),
  sku: z.string().trim().min(1),
  specifications: z.array(specSchema).optional().default([]),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();
