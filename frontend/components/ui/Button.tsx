"use client";

import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

import Spinner from "./Spinner";

type ButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children"
> & {
  children?: ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger";

  size?:
    | "sm"
    | "md"
    | "lg";

  loading?: boolean;
};

const variants = {
  primary:
    "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:brightness-110",

  secondary:
    "border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))]",

  ghost:
    "text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))]",

  danger:
    "bg-[rgb(var(--danger))] text-white hover:brightness-110",
};

const sizes = {
  sm:
    "min-h-9 px-3.5 py-2 text-xs",

  md:
    "min-h-10 px-4 py-2.5 text-sm",

  lg:
    "min-h-11 px-5 py-3 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <motion.button
      type="button"
      whileHover={
        !isDisabled
          ? { y: -1 }
          : undefined
      }
      whileTap={
        !isDisabled
          ? { scale: 0.985 }
          : undefined
      }
      transition={{
        duration: 0.14,
      }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2",
        "rounded-xl font-medium",
        "outline-none transition-all duration-150",
        "focus-visible:ring-4 focus-visible:ring-[rgb(var(--primary)/0.14)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <Spinner size="sm" />
      )}

      {children}
    </motion.button>
  );
}