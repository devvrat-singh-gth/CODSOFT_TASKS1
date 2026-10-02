"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/services/orderService";
import { ShippingAddress, PaymentMethod } from "@/types/order";

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CheckoutPage() {
  const { totals, itemCount, emptyCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
useEffect(() => {
  if (itemCount === 0 && !placedOrderId) {
    router.replace("/cart");
  }
}, [itemCount, placedOrderId, router]);
  const addressComplete = Object.values(address).every((v) => v.trim().length > 0);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      // The backend recomputes subtotal/shipping/tax/total from the cart's
      // current products — nothing calculated here is trusted server-side.
      const order = await createOrder(address, paymentMethod);
      await emptyCart();

      if (paymentMethod === "COD") {
        toast.success("Order placed");
        router.push(`/orders/${order._id}`);
      } else {
        setPlacedOrderId(order._id);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };
if (itemCount === 0 && !placedOrderId) {
  return null;
}


  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-semibold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-medium">Shipping address</h2>
            <AddressForm value={address} onChange={setAddress} />
          </section>

          <section>
            <h2 className="mb-3 font-medium">Payment method</h2>
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </section>
        </div>

        <div className="space-y-4">
          {totals && <OrderSummary totals={totals} />}

          {!placedOrderId ? (
            <Button
              className="w-full"
              size="lg"
              disabled={!addressComplete || submitting}
              onClick={handlePlaceOrder}
            >
              {submitting ? "Placing order..." : "Place order"}
            </Button>
          ) : (
            <RazorpayButton orderId={placedOrderId} user={user} />
          )}
        </div>
      </div>
    </Container>
  );
}
