"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Product } from "@/types/product";

export function FeaturedHeroCarousel({
  products,
}: {
  products: Product[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
useEffect(() => {
  if (products.length <= 1) {
    return;
  }

  const timer = window.setInterval(() => {
    setDirection(1);

    setActiveIndex((current) =>
      (current + 1) % products.length
    );
  }, 4000);

  return () => {
    window.clearInterval(timer);
  };
}, [products.length]);
  if (products.length === 0) {
    return (
      <div className="glass-strong relative flex aspect-[4/4.35] items-center justify-center overflow-hidden rounded-[clamp(1.5rem,2vw,2.25rem)] p-8 text-center">
        <div>
          <Sparkles className="mx-auto h-8 w-8 text-foreground/30" />

          <p className="mt-3 text-sm text-foreground/50">
            Discover something new.
          </p>
        </div>
      </div>
    );
  }

  const activeProduct = products[activeIndex];
  const activeImage = activeProduct?.images?.[0]?.url;

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const goNext = () => {
    setDirection(1);

    setActiveIndex(
      (current) =>
        (current + 1) % products.length
    );
  };

  const goPrevious = () => {
    setDirection(-1);

    setActiveIndex(
      (current) =>
        (current - 1 + products.length) %
        products.length
    );
  };

  return (
    <div className="relative">
      <div className="glass-strong relative aspect-[4/4.35] overflow-hidden rounded-[clamp(1.5rem,2vw,2.25rem)]">
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
        >
          <motion.div
            key={activeProduct._id}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction > 0 ? 35 : -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -35 : 35,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="absolute inset-0"
          >
            {activeImage ? (
              <Image
                src={activeImage}
                alt={
                  activeProduct.name ||
                  "Featured product"
                }
                fill
                priority={activeIndex === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <Sparkles className="h-8 w-8 text-foreground/30" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 pt-28 text-white sm:p-8 sm:pt-32">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                Featured
              </p>

              <h2 className="mt-2 max-w-lg text-[clamp(1.15rem,1.7vw,1.75rem)] font-semibold">
                {activeProduct.name}
              </h2>

              <Link
                href={`/products/${activeProduct.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-opacity hover:opacity-75"
              >
                View product
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {products.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous featured product"
              className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/45 sm:left-5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next featured product"
              className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/45 sm:right-5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1.5 backdrop-blur-md">
              {products.map((product, index) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show featured product ${index + 1}`}
                  aria-current={
                    index === activeIndex
                  }
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/45 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pointer-events-none absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-full border border-border bg-background/80 blur-[1px] sm:block" />

      <div className="pointer-events-none absolute -right-5 -top-5 hidden h-20 w-20 rounded-full border border-border bg-background/70 sm:block" />
    </div>
  );
}