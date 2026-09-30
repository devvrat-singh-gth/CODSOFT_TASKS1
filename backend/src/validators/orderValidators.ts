import { z } from "zod";
import { PaymentMethod } from "../types";

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  street: z.string().trim().min(2),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1).default("India"),
});

export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.nativeEnum(PaymentMethod),
});
