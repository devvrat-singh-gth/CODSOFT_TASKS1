import api from "./api";

interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export async function createRazorpayOrder(orderId: string) {
  const { data } = await api.post<{ data: RazorpayOrderResponse }>("/payments/create-order", {
    orderId,
  });
  return data.data;
}

export async function verifyPayment(payload: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const { data } = await api.post("/payments/verify", payload);
  return data.data;
}

export async function markPaymentFailed(orderId: string) {
  const { data } = await api.post("/payments/failed", { orderId });
  return data.data;
}
