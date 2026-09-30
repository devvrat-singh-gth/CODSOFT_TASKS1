"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getMyOrders } from "@/services/orderService";
import { Order } from "@/types/order";

function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.orders));
  }, []);

  if (orders === null) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyState title="No orders yet" description="Your placed orders will show up here." />;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OrderCard key={o._id} order={o} />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <Container className="py-10">
        <h1 className="mb-6 text-2xl font-semibold">Your orders</h1>
        <OrdersList />
      </Container>
    </ProtectedRoute>
  );
}
