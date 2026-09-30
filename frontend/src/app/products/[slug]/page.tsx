"use client";

// NOTE: the route param is named [slug] to match the frozen frontend folder
// structure, but its value is the product's MongoDB _id — the backend's
// GET /api/products/:id looks products up by id, not a slug field. If you
// add a public slug-based lookup route on the backend later, swap the id
// used here for product.slug with no other changes needed on this page.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import { ProductRating } from "@/components/products/ProductRating";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProductById } from "@/services/productService";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    getProductById(params.slug).then(setProduct).catch(() => setProduct(null));
  }, [params.slug]);

  if (!product) {
    return (
      <Container className="py-10">
        <Skeleton className="h-96 w-full" />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-muted">
            {product.images[activeImage] && (
              <Image
                src={product.images[activeImage].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm text-foreground/50">{product.brand}</p>}
          <h1 className="mt-1 text-2xl font-semibold">{product.name}</h1>
          <div className="mt-2">
            <ProductRating average={product.ratingAverage} count={product.reviewCount} />
          </div>
          <div className="mt-4 text-2xl">
            <PriceDisplay price={product.price} discountPrice={product.discountPrice} />
          </div>

          <p className="mt-4 text-sm text-foreground/70">{product.description}</p>

          {product.specifications.length > 0 && (
            <dl className="mt-6 space-y-1.5 text-sm">
              {product.specifications.map((s) => (
                <div key={s.key} className="flex gap-2">
                  <dt className="w-32 text-foreground/50">{s.key}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 w-20 rounded-lg border border-border bg-background px-3 text-sm"
            />
            <Button
              disabled={product.stock === 0}
              onClick={async () => {
                try {
                  await addItem(product._id, quantity);
                  toast.success("Added to cart");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not add to cart");
                }
              }}
            >
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </Button>
            <Button variant="outline" onClick={() => toggle(product._id)}>
              {isWishlisted(product._id) ? "Wishlisted" : "Add to wishlist"}
            </Button>
          </div>

          <p className="mt-3 text-xs text-foreground/50">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
          </p>
        </div>
      </div>
    </Container>
  );
}
