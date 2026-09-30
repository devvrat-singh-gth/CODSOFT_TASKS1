import Link from "next/link";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatus";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/orders/${order._id}`}
      className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted"
    >
      <div>
        <p className="text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
        <p className="text-xs text-foreground/50">
          {formatDate(order.createdAt)} · {order.items.length} item(s)
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
        <OrderStatusBadge status={order.orderStatus} />
      </div>
    </Link>
  );
}
