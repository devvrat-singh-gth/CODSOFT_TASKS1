import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAddition: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface CartResponse {
  cart: { _id: string; items: CartItem[] };
  totals: CartTotals;
}
