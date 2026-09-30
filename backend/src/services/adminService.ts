import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
import { OrderStatus } from "../types";

// All figures are computed live from MongoDB — nothing here is faked.
export async function getDashboardStats() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueAgg,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ orderStatus: OrderStatus.PENDING }),
    Order.countDocuments({ orderStatus: OrderStatus.PROCESSING }),
    Order.countDocuments({ orderStatus: OrderStatus.DELIVERED }),
    Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock sku").limit(20),
    Order.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email"),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg[0]?.total ?? 0,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    lowStockProducts,
    recentOrders,
  };
}
