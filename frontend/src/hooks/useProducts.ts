"use client";

import { useEffect, useState } from "react";
import { getProducts, ProductQueryParams } from "@/services/productService";
import { Product, Pagination } from "@/types/product";

export function useProducts(params: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.products);
        setPagination(res.pagination);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { products, pagination, loading, error };
}
