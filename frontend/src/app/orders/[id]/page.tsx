"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { OrderStatusBadge } from "@/components/orders/OrderStatus";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getOrderById, cancelOrder } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function OrderDetail() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrderById(params.id).then(setOrder).catch(() => setOrder(null));
  }, [params.id]);

  if (!order) return <Skeleton className="h-64 w-full" />;

  const cancellable = ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.orderStatus);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await cancelOrder(order._id);
      setOrder(updated);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-foreground/50">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mb-8">
        <OrderTimeline status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-border py-3 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="mb-1 font-medium">Shipping to</p>
            <p className="text-foreground/60">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.street}, {order.shippingAddress.city}
              <br />
              {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{formatCurrency(order.total)}</span>
            </div>
            <p className="mt-1 text-xs text-foreground/50">
              {order.paymentMethod} · {order.paymentStatus}
            </p>
          </div>

          {cancellable && (
            <Button
              variant="destructive"
              className="w-full"
              disabled={cancelling}
              onClick={handleCancel}
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <Container className="py-10">
        <OrderDetail />
      </Container>
    </ProtectedRoute>
  );
}
