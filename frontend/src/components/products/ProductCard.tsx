"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/types/product";
import { PriceDisplay } from "./PriceDisplay";
import { ProductRating } from "./ProductRating";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";

export function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { toggle, isWishlisted } = useWishlist({
    fetchOnMount: false,
  });

  const { addItem } = useCart({
    fetchOnMount: false,
  });

  const image = product.images[0]?.url;
  const wishlisted = isWishlisted(product._id);

  return (
    <article className="group flex min-w-0 h-full">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[clamp(1rem,1.4vw,1.5rem)] border border-border bg-card/60 p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-black/25 sm:p-3 lg:p-3.5 xl:p-4">
        <Link
          href={`/products/${product.slug}`}
          className="flex flex-1 flex-col"
          aria-label={`View ${product.name}`}
        >
          <div className="relative aspect-square shrink-0 overflow-hidden rounded-xl bg-muted">
            {image ? (
              <Image
                src={image}
                alt={
                  product.images[0]?.alt ||
                  product.name
                }
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 22vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-foreground/35">
                No image
              </div>
            )}

            {product.stock === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm">
                Out of stock
              </span>
            )}

            {product.isFeatured &&
              product.stock > 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm">
                  Featured
                </span>
              )}
          </div>

          <div className="flex flex-1 flex-col px-0.5 pt-3">
            <h3 className="product-title line-clamp-2 min-h-[2.75rem] font-medium">
              {product.name}
            </h3>

            <div className="mt-2">
              <ProductRating
                average={product.ratingAverage}
                count={product.reviewCount}
              />
            </div>

            <div className="mt-2.5">
              <PriceDisplay
                price={product.price}
                discountPrice={
                  product.discountPrice
                }
              />
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            toggle(product._id)
          }
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 rounded-full border border-border bg-background/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/30 hover:bg-primary/10 hover:text-primary sm:right-4 sm:top-4"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-foreground/55"
            }`}
          />
        </button>

        <Button
          size="sm"
          variant="outline"
          className="fluid-button mt-3 w-full"
          disabled={product.stock === 0}
          onClick={async () => {
            try {
              await addItem(
                product._id,
                1
              );

              toast.success(
                "Added to cart"
              );
            } catch (err) {
              toast.error(
                err instanceof Error
                  ? err.message
                  : "Could not add to cart"
              );
            }
          }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />

          {product.stock === 0
            ? "Unavailable"
            : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}