import { cn } from "@/lib/utils";

export default function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.min(
    Math.max(value, 0),
    100
  );

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--surface-muted))]",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <div
        className="h-full rounded-full bg-[rgb(var(--primary))] transition-[width] duration-500 ease-out"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}