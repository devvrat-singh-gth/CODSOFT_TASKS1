"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useCartStore } from "@/store/cartStore";
import * as cartService from "@/services/cartService";
import { useAuthStore } from "@/store/authStore";

interface UseCartOptions {
  fetchOnMount?: boolean;
}

let cartRequest: Promise<unknown> | null = null;
let cartRequestToken: string | null = null;

export function useCart({
  fetchOnMount = true,
}: UseCartOptions = {}) {
  const {
    items,
    totals,
    itemCount,
    setCart,
    clear,
  } = useCartStore();

  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;

    if (
      cartRequest &&
      cartRequestToken === token
    ) {
      await cartRequest;
      return;
    }

    setLoading(true);
    cartRequestToken = token;

    cartRequest = cartService
      .getCart()
      .then(({ cart, totals }) => {
        setCart(cart.items, totals);
      })
      .finally(() => {
        cartRequest = null;
        cartRequestToken = null;
        setLoading(false);
      });

    await cartRequest;
  }, [token, setCart]);

  useEffect(() => {
    if (!fetchOnMount) return;

    refresh();
  }, [fetchOnMount, refresh]);

  const addItem = async (
    productId: string,
    quantity = 1
  ) => {
    const {
      cart,
      totals,
    } = await cartService.addToCart(
      productId,
      quantity
    );

    setCart(cart.items, totals);
  };

  const updateItem = async (
    productId: string,
    quantity: number
  ) => {
    const {
      cart,
      totals,
    } = await cartService.updateCartItem(
      productId,
      quantity
    );

    setCart(cart.items, totals);
  };

  const removeItem = async (
    productId: string
  ) => {
    const {
      cart,
      totals,
    } = await cartService.removeCartItem(
      productId
    );

    setCart(cart.items, totals);
  };

  const emptyCart = async () => {
    await cartService.clearCart();
    clear();
  };

  return {
    items,
    totals,
    itemCount,
    loading,
    refresh,
    addItem,
    updateItem,
    removeItem,
    emptyCart,
  };
}
