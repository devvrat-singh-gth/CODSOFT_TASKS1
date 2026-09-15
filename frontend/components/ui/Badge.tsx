"use client";

import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<
  BadgeVariant,
  string
> = {
  default:
    "bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]",
  neutral:
    "bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400",
  info:
    "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-full px-2.5 py-1",
        "text-xs font-medium",
        "whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}