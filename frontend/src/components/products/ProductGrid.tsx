"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProductGrid({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:gap-5 2xl:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: index * 0.03,
            }}
            className="h-full overflow-hidden rounded-3xl border border-border bg-card p-3"
          >
            <Skeleton className="aspect-square w-full rounded-2xl" />

            <Skeleton className="mt-4 h-4 w-5/6" />

            <Skeleton className="mt-2 h-3 w-1/2" />

            <Skeleton className="mt-4 h-5 w-1/3" />

            <Skeleton className="mt-4 h-10 w-full rounded-xl" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Try changing your search or filters."
      />
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:gap-5 2xl:gap-6"
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="h-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}