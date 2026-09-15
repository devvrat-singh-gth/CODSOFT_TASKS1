import type {
  ReactNode,
} from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: Props) {
  return (
    <section className="rounded-3xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface)/0.65)] px-6 py-12 text-center sm:px-10">
      {icon && (
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]">
          {icon}
        </div>
      )}

      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[rgb(var(--muted))]">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </section>
  );
}