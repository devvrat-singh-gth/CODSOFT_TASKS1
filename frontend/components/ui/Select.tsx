"use client";

import type {
  SelectHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "children"
  > {
  label?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  options,
  id,
  className,
  ...props
}: SelectProps) {
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

      <select
        id={id}
        className={cn(
          "h-11 w-full min-w-0 rounded-xl",
          "border border-[rgb(var(--border))]",
          "bg-[rgb(var(--surface))]",
          "px-3 text-sm",
          "text-[rgb(var(--foreground))]",
          "outline-none",
          "transition",
          "focus:border-[rgb(var(--primary)/.7)]",
          "focus:ring-4",
          "focus:ring-[rgb(var(--primary)/.1)]",
          "aria-[invalid=true]:border-[rgb(var(--danger)/.65)]",
"aria-[invalid=true]:focus:border-[rgb(var(--danger)/.75)]",
"aria-[invalid=true]:focus:ring-[rgb(var(--danger)/.10)]",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}