import slugifyLib from "slugify";

// Appends a short random suffix so two products with the same name never collide.
export function toSlug(value: string, unique = true): string {
  const base = slugifyLib(value, { lower: true, strict: true, trim: true });
  if (!unique) return base;
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
