"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: ReactNode;
  children:
    | ReactNode
    | ((close: () => void) => ReactNode);
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (
      event: MouseEvent
    ) => {
      const target = event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);
const closeDropdown = () =>
  setOpen(false);
  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        {trigger}
      </div>

      <div
        className={cn(
          "absolute top-[calc(100%+0.5rem)] z-50 min-w-52",
          "origin-top",
          "rounded-2xl border border-[rgb(var(--border))]",
          "bg-[rgb(var(--surface))]",
          "p-1.5 shadow-xl shadow-black/10",
          "transition-all duration-150",
          align === "right"
            ? "right-0"
            : "left-0",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.98] opacity-0",
          menuClassName
        )}
      >
      {typeof children === "function"
  ? children(closeDropdown)
  : children}
      </div>
    </div>
  );
}