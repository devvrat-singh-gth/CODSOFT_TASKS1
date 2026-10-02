import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { FeaturedHeroCarousel } from "@/components/products/FeaturedHeroCarousel";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
export default async function HomePage() {
  const [productsResult, categoriesResult] =
    await Promise.allSettled([
      getProducts({
        featured: true,
        limit: 4,
      }),
      getCategories(),
    ]);

  if (productsResult.status === "rejected") {
    console.error("HOMEPAGE FEATURED PRODUCTS ERROR:", productsResult.reason);
  }

  if (categoriesResult.status === "rejected") {
    console.error("HOMEPAGE CATEGORIES ERROR:", categoriesResult.reason);
  }

  const featured =
    productsResult.status === "fulfilled"
      ? productsResult.value.products.slice(0, 4)
      : [];

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const categoryProducts = await Promise.all(
    categories.slice(0, 8).map(async (category) => {
      try {
        const result = await getProducts({
          category: category.slug,
          limit: 10,
        });

        const products = result.products;

        if (products.length === 0) {
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
    <main className="overflow-hidden">
      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="ambient-glow relative border-b border-border">
        <Container className="relative py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 2xl:py-24">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20">
            {/* Hero content */}
            <div className="order-2 max-w-3xl lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[clamp(0.68rem,0.7vw,0.8rem)] font-medium tracking-[0.01em] text-foreground/70 backdrop-blur-sm sm:mb-6">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Curated for everyday living
              </div>

              <h1 className="max-w-4xl font-semibold tracking-[-0.045em] text-[clamp(2.55rem,5.4vw,5.8rem)] leading-[0.98] sm:leading-[0.96]">
                Things you want.
                <br />
                <span className="text-foreground/40">
                  A better way to shop.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-[clamp(0.98rem,1.15vw,1.2rem)] leading-[1.65] tracking-[-0.01em] text-foreground/60 sm:mt-7 lg:mt-8">
                Explore thoughtfully selected products across electronics,
                fashion, home and everyday essentials — all in one simple
                shopping experience.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="fluid-button w-full sm:w-auto"
                  >
                    Explore products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/categories">
                  <Button
                    size="lg"
                    variant="outline"
                    className="fluid-button w-full sm:w-auto"
                  >
                    Browse categories
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[clamp(0.7rem,0.75vw,0.82rem)] leading-5 text-foreground/50 sm:mt-9">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Secure checkout
                </span>

                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 shrink-0" />
                  Order tracking
                </span>

                <span className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 shrink-0" />
                  Easy ordering
                </span>
              </div>
            </div>

            {/* Featured product carousel */}
            <div className="order-1 lg:order-2">
              <FeaturedHeroCarousel products={featured} />
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          CATEGORIES
          ===================================================== */}
      {categories.length > 0 && (
        <section className="border-b border-border">
          <Container className="py-12 sm:py-14 lg:py-16 xl:py-20 2xl:py-24">
            <div className="mb-8 flex items-end justify-between gap-4 sm:mb-9 lg:mb-10">
              <div>
                <p className="text-[clamp(0.65rem,0.7vw,0.78rem)] font-semibold uppercase tracking-[0.2em] text-foreground/45">
                  Explore
                </p>

                <h2 className="mt-2 font-semibold tracking-[-0.035em] text-[clamp(1.7rem,2.7vw,3rem)] leading-[1.08]">
                  Shop by category
                </h2>
              </div>

              <Link
                href="/categories"
                className="hidden items-center gap-1 text-[clamp(0.78rem,0.8vw,0.9rem)] font-medium text-foreground/60 transition-colors hover:text-foreground sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-5 2xl:gap-6">
              {categories.slice(0, 8).map((category) => {
                const product =
                  categoryProductMap.get(
                    category._id
                  );

                const imageUrl =
                  product?.images?.[0]?.url ||
                  category.image?.url;

                return (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group relative isolate overflow-hidden rounded-[clamp(1rem,1.3vw,1.4rem)] border border-border bg-muted shadow-sm transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-black/30"
                  >
                    <div className="relative aspect-[1.15/1] overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={
                            product?.images?.[0]?.alt ||
                            product?.name ||
                            category.name
                          }
                          fill
                          className="object-cover brightness-[0.62] transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-100"
                          sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span className="px-4 text-center text-[clamp(0.85rem,1vw,1rem)] font-medium text-foreground/35">
                            {category.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-500 group-hover:opacity-75" />

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                        <p className="font-semibold tracking-[-0.015em] text-white text-[clamp(0.95rem,1.15vw,1.25rem)] leading-tight">
                          {category.name}
                        </p>

                        <span className="mt-1.5 inline-flex items-center gap-1 text-[clamp(0.68rem,0.72vw,0.8rem)] font-medium text-white/70 transition-all duration-300 group-hover:text-white">
                          Shop now
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/categories"
              className="mt-6 flex items-center justify-center gap-1 text-[clamp(0.8rem,0.85vw,0.95rem)] font-medium text-foreground/60 transition-colors hover:text-foreground sm:hidden"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Container>
        </section>
      )}

      {/* =====================================================
          FEATURED PRODUCTS
          ===================================================== */}
      <section>
        <Container className="py-12 sm:py-14 lg:py-16 xl:py-20 2xl:py-24">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-9 lg:mb-10">
            <div>
              <p className="text-[clamp(0.65rem,0.7vw,0.78rem)] font-semibold uppercase tracking-[0.2em] text-foreground/45">
                Curated picks
              </p>

              <h2 className="mt-2 font-semibold tracking-[-0.035em] text-[clamp(1.7rem,2.7vw,3rem)] leading-[1.08]">
                Featured products
              </h2>

              <p className="mt-2.5 max-w-2xl text-[clamp(0.88rem,0.95vw,1.05rem)] leading-[1.6] tracking-[-0.005em] text-foreground/55">
                A selection from the latest products in the AuraBazaar
                catalog.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-1 text-[clamp(0.78rem,0.8vw,0.9rem)] font-medium text-foreground/60 transition-colors hover:text-foreground sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={featured} />

          <Link href="/products" className="mt-8 block sm:hidden">
            <Button
              variant="outline"
              className="w-full"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Container>
      </section>

      {/* =====================================================
          VALUE PROPOSITION
          ===================================================== */}
      <section className="border-t border-border bg-muted/30">
        <Container className="py-12 sm:py-14 lg:py-16 xl:py-20 2xl:py-24">
          <div className="grid gap-9 sm:grid-cols-3 sm:divide-x sm:divide-border sm:gap-0">
            <div className="sm:px-6 sm:first:pl-0">
              <ShieldCheck className="h-5 w-5 text-foreground/60 sm:h-6 sm:w-6" />

              <h3 className="mt-3 font-semibold tracking-[-0.01em] text-[clamp(0.9rem,1vw,1.05rem)]">
                Secure shopping
              </h3>

              <p className="mt-1.5 max-w-sm text-[clamp(0.8rem,0.88vw,0.95rem)] leading-[1.65] text-foreground/55">
                Your account and checkout experience are designed with
                security in mind.
              </p>
            </div>

            <div className="sm:px-6">
              <Truck className="h-5 w-5 text-foreground/60 sm:h-6 sm:w-6" />

              <h3 className="mt-3 font-semibold tracking-[-0.01em] text-[clamp(0.9rem,1vw,1.05rem)]">
                Simple order tracking
              </h3>

              <p className="mt-1.5 max-w-sm text-[clamp(0.8rem,0.88vw,0.95rem)] leading-[1.65] text-foreground/55">
                Keep track of your purchases from checkout through delivery.
              </p>
            </div>

            <div className="sm:px-6 sm:last:pr-0">
              <RotateCcw className="h-5 w-5 text-foreground/60 sm:h-6 sm:w-6" />

              <h3 className="mt-3 font-semibold tracking-[-0.01em] text-[clamp(0.9rem,1vw,1.05rem)]">
                Straightforward experience
              </h3>

              <p className="mt-1.5 max-w-sm text-[clamp(0.8rem,0.88vw,0.95rem)] leading-[1.65] text-foreground/55">
                Browse, compare and shop without unnecessary clutter.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}