"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/product";
import api from "@/services/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/products", { params: { limit: 50 } })
      .then((res) => setProducts(res.data.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleActive = async (product: Product) => {
    try {
      await api.patch(`/products/${product._id}/status`, { isActive: !product.isActive });
      toast.success("Product status updated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update product");
    }
  };

  return (
    <div>
      <AdminHeader title="Products" />
      <div className="mb-4 flex justify-end">
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-foreground/50">Loading...</p>
      ) : (
        <DataTable<Product>
          rows={products}
          columns={[
            { header: "Name", render: (p) => p.name },
            { header: "SKU", render: (p) => p.sku },
            { header: "Price", render: (p) => formatCurrency(p.price) },
            { header: "Stock", render: (p) => p.stock },
            {
              header: "Status",
              render: (p) => <Badge>{p.isActive ? "Active" : "Inactive"}</Badge>,
            },
            {
              header: "Actions",
              render: (p) => (
                <div className="flex gap-2">
                  <Link href={`/admin/products/${p._id}/edit`} className="text-xs underline">
                    Edit
                  </Link>
                  <button onClick={() => toggleActive(p)} className="text-xs underline">
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
