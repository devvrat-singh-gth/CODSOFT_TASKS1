"use client";

import {
  useState,
  type ImgHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type AvatarSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

interface AvatarProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src"
  > {
  src?: string | null;
  name?: string | null;
  fallback?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<
  AvatarSize,
  string
> = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-xl",
};

function getInitials(
  name?: string | null,
  fallback?: string
) {
  if (fallback?.trim()) {
    return fallback.trim().slice(0, 2).toUpperCase();
  }

  if (!name?.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function Avatar({
  src,
  name,
  fallback,
  size = "md",
  alt,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] =
  useState(false);
  const initials = getInitials(name, fallback);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[rgb(var(--surface-muted))]",
        "text-[rgb(var(--foreground))]",
        "font-semibold",
        "ring-1 ring-[rgb(var(--border))]",
        sizeClasses[size],
        className
      )}
    >
{src && !imageError ? (
  <img
    src={src}
    alt={alt ?? name ?? "User avatar"}
    className="h-full w-full object-cover"
    onError={() =>
      setImageError(true)
    }
    {...props}
  />
) : (
        <span
          className="flex h-full w-full items-center justify-center"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );
}