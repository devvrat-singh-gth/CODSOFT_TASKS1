"use client";

import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import * as cartService from "@/services/cartService";
import { useAuthStore } from "@/store/authStore";

export function useCart() {
  const { items, totals, itemCount, setCart, clear } = useCartStore();
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { cart, totals } = await cartService.getCart();
      setCart(cart.items, totals);
    } finally {
      setLoading(false);
    }
  }, [token, setCart]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId: string, quantity = 1) => {
    const { cart, totals } = await cartService.addToCart(productId, quantity);
    setCart(cart.items, totals);
  };

  const updateItem = async (productId: string, quantity: number) => {
    const { cart, totals } = await cartService.updateCartItem(productId, quantity);
    setCart(cart.items, totals);
  };

  const removeItem = async (productId: string) => {
    const { cart, totals } = await cartService.removeCartItem(productId);
    setCart(cart.items, totals);
  };

  const emptyCart = async () => {
    await cartService.clearCart();
    clear();
  };

  return { items, totals, itemCount, loading, addItem, updateItem, removeItem, emptyCart, refresh };
}
