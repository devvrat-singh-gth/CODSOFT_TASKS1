"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStats } from "@/components/admin/AdminStats";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";
import api from "@/services/api";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  lowStockProducts: { _id: string; name: string; stock: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <AdminHeader title="Dashboard" />
      <AdminStats
        stats={[
          { label: "Total revenue", value: formatCurrency(stats.totalRevenue) },
          { label: "Total orders", value: stats.totalOrders },
          { label: "Total products", value: stats.totalProducts },
          { label: "Total users", value: stats.totalUsers },
          { label: "Pending orders", value: stats.pendingOrders },
          { label: "Processing", value: stats.processingOrders },
          { label: "Delivered", value: stats.deliveredOrders },
          { label: "Low stock items", value: stats.lowStockProducts.length },
        ]}
      />

      {stats.lowStockProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-medium">Low stock</h2>
          <ul className="space-y-1 text-sm text-foreground/70">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id} className="flex justify-between border-b border-border py-1.5">
                <span>{p.name}</span>
                <span>{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
