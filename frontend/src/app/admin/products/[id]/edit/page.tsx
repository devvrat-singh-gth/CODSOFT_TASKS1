"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProductById } from "@/services/productService";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProductById(params.id).then(setProduct);
  }, [params.id]);

  return (
    <div>
      <AdminHeader title="Edit product" />
      {product ? <ProductForm initial={product} /> : <Skeleton className="h-96 w-full max-w-xl" />}
    </div>
  );
}
