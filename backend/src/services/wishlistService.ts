import Wishlist from "../models/Wishlist";
import { ApiError } from "../utils/apiError";
import { getProductForPurchase } from "./productService";

async function getOrCreateWishlist(userId: string) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
}

export async function getWishlist(userId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  await wishlist.populate("products", "name slug images price discountPrice stock isActive ratingAverage");
  return wishlist;
}

export async function addToWishlist(userId: string, productId: string) {
  await getProductForPurchase(productId); // validates existence/active state
  const wishlist = await getOrCreateWishlist(userId);

  const alreadyThere = wishlist.products.some((p) => p.toString() === productId);
  if (alreadyThere) throw ApiError.conflict("Product is already in your wishlist");

  wishlist.products.push(productId as unknown as never);
  await wishlist.save();
  return getWishlist(userId);
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();
  return getWishlist(userId);
}

export async function clearWishlist(userId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  wishlist.products = [];
  await wishlist.save();
  return getWishlist(userId);
}
