import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.coerce.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
});
