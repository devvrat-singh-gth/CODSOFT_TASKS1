import Cart, { ICart } from "../models/Cart";
import { ApiError } from "../utils/apiError";
import { getProductForPurchase, effectivePrice } from "./productService";

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_FLAT = 79;
const TAX_RATE = 0.18; // GST-style flat rate for a portfolio project; not a real tax engine.

async function getOrCreateCart(userId: string): Promise<ICart> {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export async function computeCartTotals(cart: ICart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const discount = 0; // Coupon/promo logic would plug in here.
  const total = Math.round((subtotal + shipping + tax - discount) * 100) / 100;
  return { subtotal, shipping, tax, discount, total };
}

export async function getCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  await cart.populate("items.product", "name slug images stock isActive price discountPrice");
  const totals = await computeCartTotals(cart);
  return { cart, totals };
}

export async function addItemToCart(userId: string, productId: string, quantity: number) {
  const product = await getProductForPurchase(productId);
  if (quantity > product.stock) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" in stock`);
  }

  const cart = await getOrCreateCart(userId);
  const price = effectivePrice(product);

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" in stock`);
    }
    existing.quantity = newQty;
    existing.priceAtAddition = price; // refresh to current price
  } else {
    cart.items.push({ product: product._id, quantity, priceAtAddition: price });
  }

  await cart.save();
  return getCart(userId);
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const product = await getProductForPurchase(productId);
  if (quantity > product.stock) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" in stock`);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw ApiError.notFound("Item not found in cart");

  item.quantity = quantity;
  item.priceAtAddition = effectivePrice(product);
  await cart.save();
  return getCart(userId);
}

export async function removeCartItem(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return getCart(userId);
}
