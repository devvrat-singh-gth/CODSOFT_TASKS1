import { OrderStatus } from "@/types/order";
import { cn } from "@/utils/cn";

const STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return <p className="text-sm font-medium text-red-600">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
              i <= currentIndex ? "bg-primary text-background" : "bg-muted text-foreground/40"
            )}
          >
            {i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("mx-2 h-0.5 flex-1", i < currentIndex ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}
