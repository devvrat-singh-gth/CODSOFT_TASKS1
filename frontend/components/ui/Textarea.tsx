"use client";

import type {
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  id,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium"
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={id}
        className={cn(
          "block w-full min-w-0",
          "rounded-xl",
          "border border-[rgb(var(--border))]",
          "bg-[rgb(var(--surface))]",
          "px-3 py-3",
          "text-sm",
          "text-[rgb(var(--foreground))]",
          "placeholder:text-[rgb(var(--muted))]",
          "outline-none",
          "transition",
          "resize-y",
          "focus:border-[rgb(var(--primary)/.7)]",
          "focus:ring-4",
          "focus:ring-[rgb(var(--primary)/.1)]",
          "aria-[invalid=true]:border-[rgb(var(--danger)/.65)]",
"aria-[invalid=true]:focus:border-[rgb(var(--danger)/.75)]",
"aria-[invalid=true]:focus:ring-[rgb(var(--danger)/.10)]",
          className
        )}
        {...props}
      />
    </div>
  );
}