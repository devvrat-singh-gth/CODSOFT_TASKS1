"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import * as wishlistService from "@/services/wishlistService";
import { useAuthStore } from "@/store/authStore";

export function useWishlist() {
  const { productIds, setIds } = useWishlistStore();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;
    wishlistService.getWishlist().then((w) => setIds(w.products.map((p) => p._id)));
  }, [token, setIds]);

  const toggle = async (productId: string) => {
    if (productIds.includes(productId)) {
      const w = await wishlistService.removeFromWishlist(productId);
      setIds(w.products.map((p) => p._id));
    } else {
      const w = await wishlistService.addToWishlist(productId);
      setIds(w.products.map((p) => p._id));
    }
  };

  return { productIds, toggle, isWishlisted: (id: string) => productIds.includes(id) };
}
