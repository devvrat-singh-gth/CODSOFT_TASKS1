"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, totals, loading } = useCart();

  if (!loading && items.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState title="Your cart is empty" description="Browse products and add something you like." />
        <div className="flex justify-center">
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-semibold">Your cart</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div>
          {items.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        <div className="space-y-4">
          {totals && <CartSummary totals={totals} />}
          <Link href="/checkout">
            <Button className="w-full" size="lg" disabled={items.length === 0}>
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
