"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { loadRazorpayScript } from "@/utils/loadRazorpayScript";
import * as paymentService from "@/services/paymentService";
import { User } from "@/types/user";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

// Handles the second half of the Razorpay flow described in the architecture:
// the order (with its authoritative total) already exists on the backend;
// this component only opens the gateway popup and, on success, sends the
// three Razorpay-provided fields to /payments/verify for signature checking.
// It never itself decides the payment succeeded.
export function RazorpayButton({ orderId, user }: { orderId: string; user: User | null }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load the payment gateway. Check your connection.");

      const { razorpayOrderId, amount, currency, keyId } = await paymentService.createRazorpayOrder(
        orderId
      );

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Storefront",
        description: "Order payment",
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await paymentService.verifyPayment({ orderId, ...response });
            toast.success("Payment successful");
            router.push(`/orders/${orderId}`);
          } catch (err) {
            await paymentService.markPaymentFailed(orderId);
            toast.error(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: async () => {
            await paymentService.markPaymentFailed(orderId).catch(() => {});
          },
        },
        theme: { color: "#111827" },
      });

      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" size="lg" onClick={handlePay} disabled={loading}>
      {loading ? "Starting payment..." : "Pay with Razorpay"}
    </Button>
  );
}
