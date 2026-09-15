"use client";

import {
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "next-themes";

const themes = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "Device",
    icon: Monitor,
  },
];

export default function AppearanceSettings() {
  const {
    theme,
    setTheme,
  } = useTheme();

  return (
    <section
      className="
        rounded-3xl
        border
        border-[rgb(var(--border))]
        bg-[rgb(var(--surface))]
        p-6
      "
    >
      <h2 className="text-lg font-semibold">
        Appearance
      </h2>

      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Customize how ProjectFlow looks.
      </p>

      <div
        className="
          mt-5
          flex
          rounded-full
          border
          border-[rgb(var(--border))]
          bg-[rgb(var(--surface-muted))]
          p-1
        "
      >
        {themes.map(
          ({
            value,
            label,
            icon: Icon,
          }) => {
            const active =
              theme === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setTheme(value)
                }
                className={`
                  flex-1
                  rounded-full
                  px-4
                  py-3
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-[rgb(var(--primary))] text-white shadow-lg"
                      : "text-[rgb(var(--muted))]"
                  }
                `}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon size={16} />
                  {label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}