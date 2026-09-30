import { Badge } from "@/components/ui/Badge";
import { OrderStatus as OrderStatusType } from "@/types/order";

const COLORS: Record<OrderStatusType, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatusType }) {
  return <Badge className={COLORS[status]}>{status}</Badge>;
}
