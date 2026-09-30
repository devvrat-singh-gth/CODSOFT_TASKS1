import api from "./api";
import { Product } from "@/types/product";

interface WishlistResponse {
  _id: string;
  products: Product[];
}

export async function getWishlist() {
  const { data } = await api.get<{ data: WishlistResponse }>("/wishlist");
  return data.data;
}

export async function addToWishlist(productId: string) {
  const { data } = await api.post<{ data: WishlistResponse }>(`/wishlist/${productId}`);
  return data.data;
}

export async function removeFromWishlist(productId: string) {
  const { data } = await api.delete<{ data: WishlistResponse }>(`/wishlist/${productId}`);
  return data.data;
}
