"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();

  const { products, loading } = useProducts({
    category: params.slug,
    limit: 24,
  });

  return (
    <Container className="py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2 text-2xl font-semibold md:text-3xl">
          Explore Category
        </h1>

        <p className="mb-8 text-sm text-foreground/60 md:text-base">
          Browse products curated for this category.
        </p>

        <ProductGrid
          products={products}
          loading={loading}
        />
      </motion.div>
    </Container>
  );
}