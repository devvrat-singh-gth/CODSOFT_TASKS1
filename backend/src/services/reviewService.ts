import Review from "../models/Review";
import Product from "../models/Product";
import Order from "../models/Order";
import { ApiError } from "../utils/apiError";
import { OrderStatus } from "../types";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";

async function recalculateProductRating(productId: string) {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingCount: count,
    reviewCount: count,
  });
}

export async function listProductReviews(productId: string, query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { product: productId, isApproved: true };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return { reviews, pagination: buildPaginationMeta(total, page, limit) };
}

// Core rule: a user may only review a product they purchased, and only after
// the order containing it has been delivered. Identity comes from the JWT,
// never from the request body.
export async function createReview(
  userId: string,
  productId: string,
  input: { orderId: string; rating: number; title?: string; comment: string }
) {
  const order = await Order.findById(input.orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== userId) {
    throw ApiError.forbidden("You can only review products from your own orders");
  }
  if (order.orderStatus !== OrderStatus.DELIVERED) {
    throw ApiError.badRequest("You can only review a product after the order is delivered");
  }

  const purchasedThisProduct = order.items.some((i) => i.product.toString() === productId);
  if (!purchasedThisProduct) {
    throw ApiError.badRequest("This product was not part of the specified order");
  }

  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) throw ApiError.conflict("You have already reviewed this product");

  const review = await Review.create({
    user: userId,
    product: productId,
    order: order._id,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
  });

  await recalculateProductRating(productId);
  return review;
}

export async function updateReview(
  userId: string,
  reviewId: string,
  data: Partial<{ rating: number; title: string; comment: string }>
) {
  const review = await Review.findById(reviewId);
  if (!review) throw ApiError.notFound("Review not found");
  if (review.user.toString() !== userId) throw ApiError.forbidden("You can only edit your own review");

  Object.assign(review, data);
  await review.save();
  await recalculateProductRating(review.product.toString());
  return review;
}

export async function deleteReview(userId: string, reviewId: string, isAdmin: boolean) {
  const review = await Review.findById(reviewId);
  if (!review) throw ApiError.notFound("Review not found");
  if (!isAdmin && review.user.toString() !== userId) {
    throw ApiError.forbidden("You can only delete your own review");
  }

  const productId = review.product.toString();
  await review.deleteOne();
  await recalculateProductRating(productId);
}
