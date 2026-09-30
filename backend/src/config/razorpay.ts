import Razorpay from "razorpay";
import { env } from "./env";

export const isRazorpayConfigured = !!env.razorpay.keyId && !!env.razorpay.keySecret;

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret,
    })
  : null;

export default razorpay;
