"use client";

import {
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "next-themes";

import {
  useEffect,
  useState,
} from "react";

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme();

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextTheme =
    theme === "dark"
      ? "light"
      : theme === "light"
        ? "system"
        : "dark";

  const Icon =
    theme === "dark"
      ? Moon
      : theme === "light"
        ? Sun
        : Monitor;

  return (
<button
  type="button"
  title={`Theme: ${theme}`}
  onClick={() =>
    setTheme(nextTheme)
  }
  aria-label={`Switch theme. Current theme: ${theme}`}
  className="
    rounded-xl
    border
    border-[rgb(var(--border))]
    bg-[rgb(var(--surface))]
    p-2
    transition
    hover:bg-[rgb(var(--surface-muted))]
  "
>
      <Icon size={18} />
    </button>
  );
}