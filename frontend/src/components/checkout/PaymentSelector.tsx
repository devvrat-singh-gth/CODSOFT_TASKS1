"use client";

import { PaymentMethod } from "@/types/order";
import { cn } from "@/utils/cn";

export function PaymentSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  const options: { value: PaymentMethod; label: string; description: string }[] = [
    { value: "COD", label: "Cash on Delivery", description: "Pay when your order arrives" },
    { value: "RAZORPAY", label: "Pay online", description: "Card, UPI or netbanking via Razorpay" },
  ];

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3",
            value === opt.value && "border-primary"
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            className="mt-1"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <div>
            <p className="text-sm font-medium">{opt.label}</p>
            <p className="text-xs text-foreground/50">{opt.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
