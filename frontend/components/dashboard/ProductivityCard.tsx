import Link from "next/link";

import {
  AlertCircle,
  ArrowUpRight,
  Target,
} from "lucide-react";

export default function ProductivityCard({
  completionRate,
  pending,
  overdue,
}: {
  completionRate: number;
  pending: number;
  overdue: number;
}) {
  const safeRate = Math.min(
    Math.max(completionRate, 0),
    100
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgb(var(--primary)/0.12),rgb(var(--surface))_55%)] p-5 sm:p-6">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgb(var(--primary)/0.08)] blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[rgb(var(--surface))] text-[rgb(var(--primary))] shadow-sm">
            <Target size={19} />
          </span>

          <span className="text-2xl font-semibold">
            {safeRate}%
          </span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Completion rate
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          Keep the momentum.
        </h2>

        <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
          {pending > 0
            ? `${pending} open task${pending === 1 ? "" : "s"} still need attention.`
            : "All current tasks are complete."}
        </p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgb(var(--surface-muted))]">
          <div
            className="h-full rounded-full bg-[rgb(var(--primary))] transition-[width] duration-700 ease-out"
            style={{
              width: `${safeRate}%`,
            }}
          />
        </div>

        {overdue > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[rgb(var(--danger)/0.06)] px-3 py-2 text-xs text-[rgb(var(--danger))]">
            <AlertCircle size={14} />
            <span>
              {overdue} overdue task
              {overdue === 1
                ? ""
                : "s"}{" "}
              need attention.
            </span>
          </div>
        )}

        <Link
          href="/tasks"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--primary))]"
        >
          Review tasks
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}