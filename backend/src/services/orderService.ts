import mongoose from "mongoose";
import Order, { IOrder, IShippingAddress } from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import { ApiError } from "../utils/apiError";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from "../types";
import { effectivePrice } from "./productService";

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_FLAT = 79;
const TAX_RATE = 0.18;

// The single most important function in the backend: it re-derives the order
// from the user's *current* cart and *current* product data. The client sends
// only a shipping address and a payment method — never prices or totals.
export async function createOrderFromCart(
  userId: string,
  shippingAddress: IShippingAddress,
  paymentMethod: PaymentMethod
): Promise<IOrder> {
  if (paymentMethod === PaymentMethod.COD) {
    // still allowed even if Razorpay isn't configured
  }

  const session = await mongoose.startSession();
  try {
    let order: IOrder | null = null;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart || cart.items.length === 0) {
        throw ApiError.badRequest("Your cart is empty");
      }

      const orderItems = [];
      let subtotal = 0;

      for (const item of cart.items) {
        const product = await Product.findById(item.product).session(session);
        if (!product || !product.isActive) {
          throw ApiError.badRequest("One of the items in your cart is no longer available");
        }
        if (item.quantity > product.stock) {
          throw ApiError.badRequest(
            `Only ${product.stock} unit(s) of "${product.name}" left in stock`
          );
        }

        const price = effectivePrice(product);
        subtotal += price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0]?.url,
          quantity: item.quantity,
          price,
        });

        // Reduce stock atomically as part of the same transaction.
        product.stock -= item.quantity;
        await product.save({ session });
      }

      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
      const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
      const discount = 0;
      const total = Math.round((subtotal + shipping + tax - discount) * 100) / 100;

      const created = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            orderStatus: OrderStatus.PENDING,
          },
        ],
        { session }
      );
      order = created[0];

      cart.items = [];
      await cart.save({ session });
    });

    if (!order) throw ApiError.internal("Order could not be created");
    return order;
  } finally {
    session.endSession();
  }
}

export async function getOrderById(orderId: string, userId: string, role: UserRole) {
  const order = await Order.findById(orderId).populate("items.product", "name images slug");
  if (!order) throw ApiError.notFound("Order not found");

  if (role !== UserRole.ADMIN && order.user.toString() !== userId) {
    throw ApiError.forbidden("You cannot view another customer's order");
  }
  return order;
}

export async function listMyOrders(userId: string, query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ user: userId }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, page, limit) };
}

export async function listAllOrders(query: Record<string, unknown> & { status?: string }) {
  const { page, limit, skip } = parsePagination(query);
  const filter: Record<string, unknown> = {};
  if (query.status) filter.orderStatus = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return { orders, pagination: buildPaginationMeta(total, page, limit) };
}

// Customer-initiated cancellation: only before the order has shipped, and
// restores stock for every line item.
export async function cancelOrder(orderId: string, userId: string, role: UserRole) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (role !== UserRole.ADMIN && order.user.toString() !== userId) {
    throw ApiError.forbidden("You cannot cancel another customer's order");
  }

  const cancellable: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING];
  if (!cancellable.includes(order.orderStatus)) {
    throw ApiError.badRequest(`Order in status ${order.orderStatus} can no longer be cancelled`);
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
      order.orderStatus = OrderStatus.CANCELLED;
      if (order.paymentStatus === PaymentStatus.PAID) {
        order.paymentStatus = PaymentStatus.REFUNDED;
      }
      await order.save({ session });
    });
  } finally {
    session.endSession();
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  order.orderStatus = status;
  await order.save();
  return order;
}

export async function updateOrderPaymentStatus(orderId: string, status: PaymentStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  order.paymentStatus = status;
  await order.save();
  return order;
}
