import { Star } from "lucide-react";

export function ProductRating({
  average,
  count,
}: {
  average: number;
  count: number;
}) {
  if (count <= 0) {
    return (
      <div className="flex items-center gap-1 text-[clamp(0.68rem,0.7vw,0.78rem)] text-foreground/40">
        <Star className="h-3.5 w-3.5 shrink-0" />
        <span>No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-[clamp(0.68rem,0.7vw,0.78rem)] text-foreground/55">
      <Star className="h-3.5 w-3.5 shrink-0 fill-current" />
      <span>{average.toFixed(1)}</span>
      <span className="text-foreground/35">({count})</span>
    </div>
  );
}