"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { useCart } from "@/hooks/useCart";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateItem, removeItem } = useCart();
  const image = item.product.images[0]?.url;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {image && <Image src={image} alt={item.product.name} fill className="object-cover" />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{item.product.name}</p>
        <div className="mt-1">
          <PriceDisplay price={item.priceAtAddition} />
        </div>
      </div>

      <QuantitySelector
        quantity={item.quantity}
        max={item.product.stock}
        onChange={(q) => updateItem(item.product._id, q)}
      />

      <button
        onClick={() => removeItem(item.product._id)}
        className="p-2 text-foreground/40 hover:text-foreground"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
