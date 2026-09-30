import crypto from "crypto";
import { env } from "../config/env";

// Verifies the HMAC-SHA256 signature Razorpay sends back after checkout so the
// backend never marks an order paid on the frontend's say-so alone.
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}
