import { CartTotals } from "@/types/cart";
import { formatCurrency } from "@/utils/formatCurrency";

export function OrderSummary({ totals }: { totals: CartTotals }) {
  return (
    <div className="rounded-xl border border-border p-5 text-sm">
      <h2 className="mb-4 font-medium">Order total</h2>
      <div className="space-y-2 text-foreground/70">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></div>
      </div>
      <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
        <span>Total</span><span>{formatCurrency(totals.total)}</span>
      </div>
    </div>
  );
}
