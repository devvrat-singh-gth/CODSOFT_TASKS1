import { CartTotals } from "@/types/cart";
import { formatCurrency } from "@/utils/formatCurrency";

export function CartSummary({ totals }: { totals: CartTotals }) {
  const rows: [string, number][] = [
    ["Subtotal", totals.subtotal],
    ["Shipping", totals.shipping],
    ["Tax", totals.tax],
  ];
  if (totals.discount > 0) rows.push(["Discount", -totals.discount]);

  return (
    <div className="rounded-xl border border-border p-5">
      <h2 className="mb-4 font-medium">Order summary</h2>
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-foreground/70">
            <span>{label}</span>
            <span>{value === 0 ? "Free" : formatCurrency(value)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}
