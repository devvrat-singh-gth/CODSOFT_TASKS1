import { z } from "zod";

export const createReviewSchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(2).max(2000),
});

export const updateReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(2).max(2000).optional(),
});
