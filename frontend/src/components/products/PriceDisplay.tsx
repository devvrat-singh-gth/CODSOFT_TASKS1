import { formatCurrency } from "@/utils/formatCurrency";

export function PriceDisplay({ price, discountPrice }: { price: number; discountPrice?: number }) {
  const hasDiscount = !!discountPrice && discountPrice < price;
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{formatCurrency(hasDiscount ? discountPrice! : price)}</span>
      {hasDiscount && (
        <span className="text-sm text-foreground/50 line-through">{formatCurrency(price)}</span>
      )}
    </div>
  );
}
