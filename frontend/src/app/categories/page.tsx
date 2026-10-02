import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const categoryProducts = await Promise.all(
    categories.map(async (category) => {
      try {
const result = await getProducts({
  category: category.slug,
  limit: 20,
});

        const products = result.products;

        if (!products.length) {
          return {
            categoryId: category._id,
            product: null,
          };
        }

        const randomProduct =
          products[
            Math.floor(
              Math.random() * products.length
            )
          ];

        return {
          categoryId: category._id,
          product: randomProduct,
        };
      } catch {
        return {
          categoryId: category._id,
          product: null,
        };
      }
    })
  );

  const categoryProductMap = new Map(
    categoryProducts.map((item) => [
      item.categoryId,
      item.product,
    ])
  );

  return (
    <Container className="page-section">
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
          Browse
        </p>

        <h1 className="section-title mt-2 font-semibold">
          Categories
        </h1>

        <p className="section-description mt-3 max-w-2xl text-foreground/60">
          Explore products by category and discover curated collections.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:gap-5 2xl:gap-6">
        {categories.map((category) => {
          const product =
            categoryProductMap.get(category._id);

          const imageUrl =
            product?.images?.[0]?.url ||
            category.image?.url;

          return (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group relative isolate overflow-hidden rounded-[clamp(1rem,1.5vw,1.5rem)] border border-border bg-card shadow-sm transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-black/30"
            >
              <div className="relative aspect-[1.1/1] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={
                      product?.images?.[0]?.alt ||
                      `${category.name} category`
                    }
                    fill
                    className="object-cover brightness-[0.62] transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-100"
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-foreground/40">
                      {category.name}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/65" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h2 className="font-semibold text-white">
                    {category.name}
                  </h2>

                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-white/80 transition-transform duration-300 group-hover:translate-x-1">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
