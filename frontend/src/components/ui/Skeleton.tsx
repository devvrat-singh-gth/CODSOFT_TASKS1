import { cn } from "@/utils/cn";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        `
        relative
        overflow-hidden
        rounded-xl
        bg-muted
        `,
        className
      )}
    >
      <div
        className="
        absolute
        inset-0
        animate-[shimmer_1.6s_infinite]
        bg-gradient-to-r
        from-transparent
        via-white/10
        to-transparent
        "
      />
    </div>
  );
}
