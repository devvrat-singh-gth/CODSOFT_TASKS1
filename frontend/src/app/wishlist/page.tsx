"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import * as wishlistService from "@/services/wishlistService";
import { Product } from "@/types/product";

function WishlistItems() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    wishlistService.getWishlist().then((w) => setProducts(w.products));
  }, []);

  return <ProductGrid products={products || []} loading={products === null} />;
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <Container className="py-10">
        <h1 className="mb-6 text-2xl font-semibold">Your wishlist</h1>
        <WishlistItems />
      </Container>
    </ProtectedRoute>
  );
}
