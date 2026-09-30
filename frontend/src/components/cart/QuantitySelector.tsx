"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  quantity,
  onChange,
  max,
}: {
  quantity: number;
  onChange: (q: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center rounded-lg border border-border">
      <button
        className="p-2 disabled:opacity-30"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm">{quantity}</span>
      <button
        className="p-2 disabled:opacity-30"
        disabled={max !== undefined && quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
