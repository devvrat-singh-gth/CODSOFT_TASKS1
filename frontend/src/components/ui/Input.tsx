import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm",
      "text-foreground placeholder:text-foreground/35",
      "outline-none transition-all",
      "focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";