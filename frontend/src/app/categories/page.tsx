import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getCategories } from "@/services/categoryService";

export default async function CategoriesPage() {
  const categories = await getCategories();

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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[1.1/1] overflow-hidden">
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <span className="text-foreground/40">
                    {category.name}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-semibold text-white">
                  {category.name}
                </h2>

                <span className="mt-2 inline-flex items-center gap-1 text-sm text-white/80">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}