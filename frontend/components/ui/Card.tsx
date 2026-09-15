interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border",
        "bg-[rgb(var(--surface))]",
        "shadow-[0_12px_40px_rgb(15_23_42/0.04)]",
        "dark:shadow-[0_20px_50px_rgb(0_0_0/0.18)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}