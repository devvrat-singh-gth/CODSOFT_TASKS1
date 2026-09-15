"use client";

import Link from "next/link";

import {
  ChevronRight,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

const labels: Record<
  string,
  string
> = {
  dashboard: "Dashboard",
  projects: "Projects",
  tasks: "Tasks",
  profile: "Profile",
  notifications: "Notifications",
};

export default function Breadcrumbs() {
  const pathname =
    usePathname();

  const parts =
    pathname
      .split("/")
      .filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-1.5 text-xs text-[rgb(var(--muted))] sm:flex"
    >
      {parts.map(
        (part, index) => {
          const last =
            index ===
            parts.length - 1;

          const label =
            labels[part] ||
            (part.length > 12
              ? "Details"
              : part);

          const href = `/${parts
            .slice(0, index + 1)
            .join("/")}`;

          return (
            <span
              key={`${part}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  size={13}
                />
              )}

              {last ? (
                <span className="font-medium text-[rgb(var(--foreground))]">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition hover:text-[rgb(var(--foreground))]"
                >
                  {label}
                </Link>
              )}
            </span>
          );
        }
      )}
    </nav>
  );
}