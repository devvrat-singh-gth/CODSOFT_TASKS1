import { cn } from "@/lib/utils";

export default function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        [
          "relative",
          "overflow-hidden",
          "rounded-xl",

          "bg-[rgb(var(--surface-muted))]",

          "before:absolute",
          "before:inset-0",

          "before:-translate-x-full",

          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-[rgb(var(--foreground)/0.06)]",
          "before:to-transparent",

          "before:animate-[shimmer_1.8s_infinite]",

          "border",
          "border-[rgb(var(--border)/0.5)]",
        ].join(" "),
        className
      )}
    />
  );
}