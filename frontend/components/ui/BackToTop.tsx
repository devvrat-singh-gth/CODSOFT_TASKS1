"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowUp,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface BackToTopProps {
  className?: string;
  threshold?: number;
}

export default function BackToTop({
  className,
  threshold = 500,
}: BackToTopProps) {
  const [
    visible,
    setVisible,
  ] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        setVisible(
          window.scrollY > threshold
        );

        ticking = false;
      });
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 12,
            scale: 0.92,
          }}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.94,
          }}
          transition={{
            duration: 0.18,
          }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-5 right-5 z-40",
            "grid h-11 w-11 place-items-center",
            "rounded-xl border",
            "border-[rgb(var(--border))]",
            "bg-[rgb(var(--surface)/0.9)]",
            "text-[rgb(var(--foreground))]",
            "shadow-lg shadow-black/10",
            "backdrop-blur-xl",
            "transition-colors",
            "hover:bg-[rgb(var(--surface-muted))]",
            "focus:outline-none",
            "focus:ring-4",
            "focus:ring-[rgb(var(--primary)/0.12)]",
            className
          )}
        >
          <ArrowUp
            size={18}
            strokeWidth={2.2}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}