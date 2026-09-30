import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

export default async function HomePage() {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
  ]);

  const featured =
    productsResult.status === "fulfilled"
      ? productsResult.value.products
      : [];

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const heroProduct = featured[0];
  const heroImage = heroProduct?.images?.[0]?.url;

  return (
    <main className="overflow-hidden">
      {/* Hero */}
   <section className="ambient-glow relative border-b border-border">
  <Container className="relative py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28">
    <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20 2xl:gap-24">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground/70">
                <Sparkles className="h-3.5 w-3.5" />
                Curated for everyday living
              </div>

              <h1 className="hero-title max-w-4xl font-semibold">
                Things you want.
                <br />
                <span className="text-foreground/45">
                  A better way to shop.
                </span>
              </h1>

              <p className="hero-description mt-6 max-w-2xl text-foreground/60">
                Explore thoughtfully selected products across electronics,
                fashion, home and everyday essentials — all in one simple
                shopping experience.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="fluid-button w-full sm:w-auto">
                    Explore products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/categories">
                  <Button size="lg"                    
                  variant="outline"
                  className="fluid-button w-full sm:w-auto">
                    Browse categories
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-foreground/50">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Secure checkout
                </span>

                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Order tracking
                </span>

                <span className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Easy ordering
                </span>
              </div>
            </div>

            {/* Dynamic hero product */}
            <div className="relative">
             <div className="glass-strong relative aspect-[4/4.7] overflow-hidden rounded-[clamp(1.5rem,2vw,2.25rem)]">
                {heroImage ? (
                  <>
                    <Image
                      src={heroImage}
                      alt={heroProduct?.name || "Featured product"}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-6 pt-24 text-white sm:p-8 sm:pt-28">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                        Featured
                      </p>

                      <h2 className="mt-2 max-w-lg text-[clamp(1.15rem,1.7vw,1.75rem)] font-semibold">
                        {heroProduct.name}
                      </h2>

                      <Link
                        href={`/products/${heroProduct._id}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-opacity hover:opacity-75"
                      >
                        View product
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <div>
                      <Sparkles className="mx-auto h-8 w-8 text-foreground/30" />
                      <p className="mt-3 text-sm text-foreground/50">
                        Discover something new.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pointer-events-none absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-full border border-border bg-background/80 blur-[1px] sm:block" />
              <div className="pointer-events-none absolute -right-5 -top-5 hidden h-20 w-20 rounded-full border border-border bg-background/70 sm:block" />
            </div>
          </div>
        </Container>
      </section>
      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-b border-border">
          <Container className="page-section-sm">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
                  Explore
                </p>

                <h2 className="section-title mt-2 font-semibold">
                  Shop by category
                </h2>
              </div>

              <Link
                href="/categories"
                className="hidden items-center gap-1 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-5 2xl:gap-6">
              {categories.slice(0, 8).map((category) => {
                const imageUrl = category.image?.url;

                return (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-muted"
                  >
                    <div className="relative aspect-[1.15/1]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span className="px-4 text-center text-sm font-medium text-foreground/35">
                            {category.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <p className="font-medium text-white">
                          {category.name}
                        </p>

                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/70 transition-colors group-hover:text-white">
                          Shop now
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/categories"
              className="mt-5 flex items-center justify-center gap-1 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground sm:hidden"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Container>
        </section>
      )}

      {/* Featured products */}
      <section>
       <Container className="page-section">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
                Curated picks
              </p>

              <h2 className="section-title mt-2 font-semibold">
                Featured products
              </h2>

              <p className="section-description mt-2 max-w-2xl text-foreground/55">
                A selection from the latest products in the AuraBazaar
                catalog.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={featured} />

          <Link href="/products" className="mt-7 block sm:hidden">
            <Button variant="outline" className="w-full">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Container>
      </section>

      {/* Value proposition */}
      <section className="border-t border-border bg-muted/30">
        <Container className="py-12 sm:py-14 xl:py-16 2xl:py-20">
          <div className="grid gap-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
            <div className="sm:px-6 sm:first:pl-0">
              <ShieldCheck className="h-5 w-5 text-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">
                Secure shopping
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/55">
                Your account and checkout experience are designed with
                security in mind.
              </p>
            </div>

            <div className="sm:px-6">
              <Truck className="h-5 w-5 text-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">
                Simple order tracking
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/55">
                Keep track of your purchases from checkout through delivery.
              </p>
            </div>

            <div className="sm:px-6 sm:last:pr-0">
              <RotateCcw className="h-5 w-5 text-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">
                Straightforward experience
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/55">
                Browse, compare and shop without unnecessary clutter.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}