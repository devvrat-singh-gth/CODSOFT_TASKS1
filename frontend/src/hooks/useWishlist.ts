"use client";

import { useEffect } from "react";

import { useWishlistStore } from "@/store/wishlistStore";
import * as wishlistService from "@/services/wishlistService";
import { useAuthStore } from "@/store/authStore";

interface UseWishlistOptions {
  fetchOnMount?: boolean;
}

let wishlistRequest: Promise<unknown> | null = null;
let wishlistRequestToken: string | null = null;

export function useWishlist({
  fetchOnMount = true,
}: UseWishlistOptions = {}) {
  const {
    productIds,
    setIds,
  } = useWishlistStore();

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!fetchOnMount || !token) {
      return;
    }

    if (
      wishlistRequest &&
      wishlistRequestToken === token
    ) {
      return;
    }

    wishlistRequestToken = token;

    wishlistRequest = wishlistService
      .getWishlist()
      .then((wishlist) => {
        setIds(
          wishlist.products.map(
            (product) => product._id
          )
        );
      })
      .finally(() => {
        wishlistRequest = null;
        wishlistRequestToken = null;
      });
  }, [
    fetchOnMount,
    token,
    setIds,
  ]);

  const toggle = async (
    productId: string
  ) => {
    if (productIds.includes(productId)) {
      const wishlist =
        await wishlistService.removeFromWishlist(
          productId
        );

      setIds(
        wishlist.products.map(
          (product) => product._id
        )
      );
    } else {
      const wishlist =
        await wishlistService.addToWishlist(
          productId
        );

      setIds(
        wishlist.products.map(
          (product) => product._id
        )
      );
    }
  };

  return {
    productIds,
    toggle,
    isWishlisted: (id: string) =>
      productIds.includes(id),
  };
}
