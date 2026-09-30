import api from "./api";
import { CartResponse } from "@/types/cart";

export async function getCart() {
  const { data } = await api.get<{ data: CartResponse }>("/cart");
  return data.data;
}

export async function addToCart(productId: string, quantity = 1) {
  const { data } = await api.post<{ data: CartResponse }>("/cart/items", { productId, quantity });
  return data.data;
}

export async function updateCartItem(productId: string, quantity: number) {
  const { data } = await api.put<{ data: CartResponse }>(`/cart/items/${productId}`, { quantity });
  return data.data;
}

export async function removeCartItem(productId: string) {
  const { data } = await api.delete<{ data: CartResponse }>(`/cart/items/${productId}`);
  return data.data;
}

export async function clearCart() {
  const { data } = await api.delete<{ data: CartResponse }>("/cart");
  return data.data;
}
