import { create } from "zustand";
import { CartItem, CartTotals } from "@/types/cart";

interface CartState {
  items: CartItem[];
  totals: CartTotals | null;
  itemCount: number;
  setCart: (items: CartItem[], totals: CartTotals) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totals: null,
  itemCount: 0,

  setCart: (items, totals) =>
    set({ items, totals, itemCount: items.reduce((n, i) => n + i.quantity, 0) }),

  clear: () => set({ items: [], totals: null, itemCount: 0 }),
}));
