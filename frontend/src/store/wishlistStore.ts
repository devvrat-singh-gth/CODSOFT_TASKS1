import { create } from "zustand";

interface WishlistState {
  productIds: string[];
  setIds: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  productIds: [],
  setIds: (ids) => set({ productIds: ids }),
}));
