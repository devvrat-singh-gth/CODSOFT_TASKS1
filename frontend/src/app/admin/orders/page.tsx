"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { OrderStatusBadge } from "@/components/orders/OrderStatus";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Order, OrderStatus } from "@/types/order";
import api from "@/services/api";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => api.get("/admin/orders", { params: { limit: 50 } }).then((res) => setOrders(res.data.data.orders));
  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update order");
    }
  };

  return (
    <div>
      <AdminHeader title="Orders" />
      <DataTable<Order & { user?: { name: string } }>
        rows={orders as (Order & { user?: { name: string } })[]}
        columns={[
          { header: "Order", render: (o) => `#${o._id.slice(-8).toUpperCase()}` },
          { header: "Customer", render: (o) => o.user?.name || "—" },
          { header: "Date", render: (o) => formatDate(o.createdAt) },
          { header: "Total", render: (o) => formatCurrency(o.total) },
          { header: "Payment", render: (o) => o.paymentStatus },
          { header: "Status", render: (o) => <OrderStatusBadge status={o.orderStatus} /> },
          {
            header: "Update",
            render: (o) => (
              <select
                defaultValue={o.orderStatus}
                onChange={(e) => updateStatus(o._id, e.target.value as OrderStatus)}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
          },
        ]}
      />
    </div>
  );
}
