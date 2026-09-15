import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isValid,
  parseISO,
} from "date-fns";

/**
 * Safely combines conditional class names and
 * resolves Tailwind class conflicts.
 *
 * Example:
 * cn(
 *   "px-4 py-2",
 *   isActive && "bg-primary",
 *   className
 * )
 */
export function cn(
  ...inputs: ClassValue[]
): string {
  return twMerge(clsx(inputs));
}

/**
 * Returns initials suitable for avatars.
 *
 * Examples:
 * "Dev Sharma" -> "DS"
 * "Dev" -> "D"
 * "" -> "?"
 */
export function getInitials(
  name?: string | null
): string {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
}

/**
 * Truncates long text without breaking the UI.
 */
export function truncate(
  value: string | null | undefined,
  maxLength: number
): string {
  if (!value) {
    return "";
  }

  if (
    !Number.isFinite(maxLength) ||
    maxLength <= 0
  ) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Safely formats an ISO date.
 *
 * Returns a fallback instead of throwing when
 * the value is missing or invalid.
 */
export function formatDate(
  value: string | Date | null | undefined,
  fallback = "—"
): string {
  if (!value) {
    return fallback;
  }

  try {
    const date =
      value instanceof Date
        ? value
        : parseISO(value);

    if (!isValid(date)) {
      return fallback;
    }

    return format(
      date,
      "dd MMM yyyy"
    );
  } catch {
    return fallback;
  }
}

/**
 * Safely formats a date and time.
 */
export function formatDateTime(
  value: string | Date | null | undefined,
  fallback = "—"
): string {
  if (!value) {
    return fallback;
  }

  try {
    const date =
      value instanceof Date
        ? value
        : parseISO(value);

    if (!isValid(date)) {
      return fallback;
    }

    return format(
      date,
      "dd MMM yyyy, h:mm a"
    );
  } catch {
    return fallback;
  }
}