import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        "px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
        "max-w-[1800px]",
        className
      )}
    >
      {children}
    </div>
  );
}