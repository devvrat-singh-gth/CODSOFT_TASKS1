"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Heart, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/layout/Container";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import { ProductRating } from "@/components/products/ProductRating";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProductBySlug } from "@/services/productService";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    if (!params.slug) return;

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(false);
        setProduct(null);
        setActiveImage(0);
        setQuantity(1);

        const data = await getProductBySlug(params.slug);

        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled) {
          setProduct(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <Container className="py-7 sm:py-10 lg:py-14 2xl:py-16">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
          <div>
            <Skeleton className="aspect-square w-full rounded-[1.5rem] sm:rounded-[2rem]" />

            <div className="mt-3 flex gap-2 sm:mt-4 sm:gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16"
                />
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[1.5rem] border border-border bg-card/40 p-5 sm:p-7 lg:p-8 xl:p-10">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full max-w-xl sm:h-10" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-[1.5rem] border border-border bg-card/50 px-6 py-10 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <h1 className="mt-5 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight">
            Product not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/55 sm:text-base">
            This product may no longer be available.
          </p>
        </div>
      </Container>
    );
  }

  const wishlisted = isWishlisted(product._id);

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, Math.max(product.stock, 1))
    );
  };

  const handleQuantityInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value)) {
      setQuantity(1);
      return;
    }

    setQuantity(
      Math.min(
        Math.max(Math.floor(value), 1),
        Math.max(product.stock, 1)
      )
    );
  };

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not add to cart"
      );
    }
  };

  const handleWishlist = () => {
    toggle(product._id);
  };

  return (
    <Container className="py-6 sm:py-9 lg:py-12 xl:py-14 2xl:py-16">
      <div className="grid grid-cols-1 gap-7 md:items-stretch md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
        {/* =====================================================
            PRODUCT GALLERY
            ===================================================== */}
 <div className="min-w-0 md:flex md:h-full md:flex-col">
  <div
    className="
      group relative w-full overflow-hidden
      rounded-[1.35rem]
      border border-border/70
      bg-card shadow-sm
      sm:rounded-[1.75rem]
      lg:flex-1
      lg:rounded-[2rem]
    "
  >
    {product.images[activeImage] ? (
      <div className="relative flex w-full items-center justify-center">
        <Image
          src={product.images[activeImage].url}
          alt={
            product.images[activeImage].alt ||
            product.name
          }
          width={1200}
          height={1200}
          priority
          className="
            block
            h-auto
            w-full
            object-contain
            transition-transform
            duration-500
            group-hover:scale-[1.015]
          "
          sizes="
            (max-width: 767px) 100vw,
            (max-width: 1279px) 52vw,
            55vw
          "
        />
      </div>
    ) : (
      <div className="flex min-h-[18rem] w-full items-center justify-center text-sm text-foreground/40">
        No image available
      </div>
    )}

    {product.discountPrice &&
      product.discountPrice < product.price && (
        <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1.5 text-[0.68rem] font-semibold text-primary-foreground shadow-lg sm:left-5 sm:top-5 sm:px-3.5 sm:py-2">
          Sale
        </div>
      )}
  </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 sm:mt-4 sm:gap-3">
              {product.images.map((img, index) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-current={index === activeImage}
                  className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-card transition-all duration-200 sm:h-[4.5rem] sm:w-[4.5rem] ${
                    index === activeImage
                      ? "border-primary shadow-[0_0_0_2px] shadow-primary/20"
                      : "border-border/70 opacity-70 hover:border-primary/40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={
                      img.alt ||
                      `${product.name} image ${index + 1}`
                    }
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =====================================================
            PRODUCT INFORMATION
            ===================================================== */}
        <div className="min-w-0 rounded-[1.5rem] border border-border/70 bg-card/45 p-5 shadow-sm backdrop-blur-sm sm:rounded-[2rem] sm:p-7 lg:p-8 xl:p-9 2xl:p-10">
          <div>
            {product.brand && (
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
                {product.brand}
              </p>
            )}

            <h1 className="mt-2 max-w-3xl text-[clamp(1.65rem,3.2vw,3.35rem)] font-semibold leading-[1.08] tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3 sm:mt-4">
              <ProductRating
                average={product.ratingAverage}
                count={product.reviewCount}
              />
            </div>
          </div>

          <div className="mt-5 border-t border-border/70 pt-5 sm:mt-6 sm:pt-6">
            <div className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold">
              <PriceDisplay
                price={product.price}
                discountPrice={product.discountPrice}
              />
            </div>
          </div>

          <p className="mt-5 text-[clamp(0.84rem,1vw,1rem)] leading-6 text-foreground/65 sm:mt-6 sm:leading-7">
            {product.description}
          </p>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="mt-7 border-t border-border/70 pt-6 sm:mt-8 sm:pt-7">
              <h2 className="text-sm font-semibold sm:text-base">
                Specifications
              </h2>

              <dl className="mt-4 grid overflow-hidden rounded-2xl border border-border/70 bg-background/30">
                {product.specifications.map(
                  (specification, index) => (
                    <div
                      key={specification.key}
                      className={`grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 px-4 py-3 text-sm sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] sm:px-5 ${
                        index !== 0
                          ? "border-t border-border/60"
                          : ""
                      }`}
                    >
                      <dt className="min-w-0 break-words text-foreground/45">
                        {specification.key}
                      </dt>

                      <dd className="min-w-0 break-words font-medium text-foreground/80">
                        {specification.value}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          )}

          {/* Stock */}
          <div className="mt-6 flex items-center gap-2 sm:mt-7">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                product.stock > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
            </span>

            <p className="text-xs font-medium text-foreground/60 sm:text-sm">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Currently unavailable"}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 border-t border-border/70 pt-6 sm:mt-7 sm:pt-7">
            <div className="flex w-full items-stretch gap-2.5 sm:items-center sm:gap-3">
  {/* Quantity */}
  <div className="flex h-12 shrink-0 items-center rounded-xl border border-border bg-background/60 px-1 sm:h-12 sm:min-w-[8.5rem]">
    <button
      type="button"
      onClick={decreaseQuantity}
      disabled={product.stock === 0 || quantity <= 1}
      aria-label="Decrease quantity"
      className="flex h-10 w-9 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-30 sm:w-10"
    >
      <Minus className="h-4 w-4" />
    </button>

    <input
      type="number"
      min={1}
      max={Math.max(product.stock, 1)}
      value={quantity}
      onChange={handleQuantityInput}
      disabled={product.stock === 0}
      aria-label="Quantity"
      className="h-10 w-9 appearance-none border-0 bg-transparent p-0 text-center text-sm font-semibold outline-none [appearance:textfield] focus:ring-0 sm:w-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />

    <button
      type="button"
      onClick={increaseQuantity}
      disabled={
        product.stock === 0 ||
        quantity >= product.stock
      }
      aria-label="Increase quantity"
      className="flex h-10 w-9 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-30 sm:w-10"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>

  {/* Add to cart */}
  <Button
    disabled={product.stock === 0}
    onClick={handleAddToCart}
    className="h-12 min-w-0 flex-1 rounded-xl px-3 text-sm font-semibold sm:px-5"
  >
    <ShoppingBag className="mr-1.5 h-4 w-4 sm:mr-2" />

    {product.stock === 0
      ? "Out of stock"
      : "Add to cart"}
  </Button>
</div>
            {/* Wishlist */}
          <Button
  variant="outline"
  onClick={handleWishlist}
  className={`mt-2.5 h-11 w-full rounded-xl text-sm font-medium sm:mt-3 sm:h-12 ${
    wishlisted
      ? "border-primary/40 bg-primary/10 text-primary"
      : ""
  }`}
>
  <Heart
    className={`mr-2 h-4 w-4 ${
      wishlisted ? "fill-current" : ""
    }`}
  />

  {wishlisted
    ? "Wishlisted"
    : "Add to wishlist"}
</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
