import razorpay, { isRazorpayConfigured } from "../config/razorpay";
import Order from "../models/Order";
import Payment from "../models/Payment";
import { ApiError } from "../utils/apiError";
import { verifyRazorpaySignature } from "../utils/verifySignature";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../types";

// Step 1 of the Razorpay flow: the backend creates the gateway order using the
// order total *already computed by orderService* — the amount is never taken
// from the client.
export async function createRazorpayOrder(orderId: string, userId: string) {
  if (!isRazorpayConfigured || !razorpay) {
    throw ApiError.internal("Online payments are not configured on this server");
  }

  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== userId) throw ApiError.forbidden("This is not your order");
  if (order.paymentMethod !== PaymentMethod.RAZORPAY) {
    throw ApiError.badRequest("This order was not created for online payment");
  }
  if (order.paymentStatus === PaymentStatus.PAID) {
    throw ApiError.badRequest("This order has already been paid");
  }

  const amountInPaise = Math.round(order.total * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: order._id.toString(),
  });

  const payment = await Payment.create({
    order: order._id,
    user: userId,
    provider: PaymentMethod.RAZORPAY,
    providerOrderId: razorpayOrder.id,
    amount: order.total,
    currency: "INR",
    status: PaymentStatus.PENDING,
  });

  order.payment = payment._id;
  await order.save();

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID, // public key only — never the secret
  };
}

// Step 2: the backend independently verifies the HMAC signature Razorpay
// returns to the frontend. This is the only trustworthy way to know a
// payment actually succeeded — a closed checkout popup proves nothing.
export async function verifyRazorpayPayment(params: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
}) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = params;

  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== userId) throw ApiError.forbidden("This is not your order");

  const payment = await Payment.findOne({ order: order._id, providerOrderId: razorpay_order_id });
  if (!payment) throw ApiError.badRequest("No matching payment record for this order");

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    payment.status = PaymentStatus.FAILED;
    await payment.save();
    order.paymentStatus = PaymentStatus.FAILED;
    await order.save();
    throw ApiError.badRequest("Payment verification failed");
  }

  payment.status = PaymentStatus.PAID;
  payment.providerPaymentId = razorpay_payment_id;
  payment.verifiedAt = new Date();
  await payment.save();

  order.paymentStatus = PaymentStatus.PAID;
  order.orderStatus = OrderStatus.CONFIRMED;
  await order.save();

  return { order, payment };
}

export async function handlePaymentFailure(orderId: string, userId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== userId) throw ApiError.forbidden("This is not your order");

  order.paymentStatus = PaymentStatus.FAILED;
  await order.save();

  if (order.payment) {
    await Payment.findByIdAndUpdate(order.payment, { status: PaymentStatus.FAILED });
  }
  return order;
}
