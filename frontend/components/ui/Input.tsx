"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type InputProps =
  InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      className,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          // Layout
          "block w-full min-w-0",

          // Responsive size
          "h-11 sm:h-12",

          // Shape
          "rounded-xl",

          // Border
          "border border-[rgb(var(--border))]",

          // Surface
          "bg-[rgb(var(--surface))]",

          // Spacing
          "px-3.5 sm:px-4",

          // Typography
          "text-sm text-[rgb(var(--foreground))]",
          "placeholder:text-[rgb(var(--muted))]",

          // Interaction
          "outline-none transition-all duration-200",

          // Focus
          "focus:border-[rgb(var(--primary)/0.7)]",
          "focus:ring-4",
          "focus:ring-[rgb(var(--primary)/0.10)]",

          // Validation
          "aria-[invalid=true]:border-[rgb(var(--danger)/0.65)]",
          "aria-[invalid=true]:focus:border-[rgb(var(--danger)/0.75)]",
          "aria-[invalid=true]:focus:ring-[rgb(var(--danger)/0.10)]",

          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:opacity-60",

          // Consumer overrides
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;