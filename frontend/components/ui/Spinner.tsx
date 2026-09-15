export default function Spinner({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: {
      outer: "h-8 w-8",
      inner: "h-5 w-5",
      text: "text-[10px]",
    },
    md: {
      outer: "h-14 w-14",
      inner: "h-9 w-9",
      text: "text-xs",
    },
    lg: {
      outer: "h-24 w-24 sm:h-28 sm:w-28",
      inner: "h-16 w-16 sm:h-20 sm:w-20",
      text: "text-sm",
    },
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative flex items-center justify-center"
    >
      {/* Outer ring */}

      <span
        className={[
          "absolute rounded-full",
          "border border-[rgb(var(--primary)/0.18)]",
          sizes[size].outer,
        ].join(" ")}
      />

      {/* Animated ring */}

      <span
        className={[
          "absolute rounded-full",
          "border-2 border-transparent",
          "border-t-[rgb(var(--primary))]",
          "border-r-[rgb(var(--accent))]",
          "animate-spin",
          sizes[size].outer,
        ].join(" ")}
      />

      {/* Pulse core */}

      <span
        className={[
          "absolute rounded-full",
          "bg-[rgb(var(--primary)/0.15)]",
          "animate-pulse",
          sizes[size].inner,
        ].join(" ")}
      />

      {/* Center text */}

      <span
        className={[
          "relative z-10",
          "font-semibold tracking-wider",
          "text-[rgb(var(--primary))]",
          sizes[size].text,
        ].join(" ")}
      >
        LOADING
      </span>
    </div>
  );
}