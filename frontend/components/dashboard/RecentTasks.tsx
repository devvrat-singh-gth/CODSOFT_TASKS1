import Link from "next/link";

import {
  ArrowRight,
  CircleCheck,
  Clock3,
} from "lucide-react";

import type {
  Task,
} from "@/types/task";

const statusLabel = (
  status: Task["status"]
) =>
  status === "DONE"
    ? "Done"
    : status === "IN_PROGRESS"
      ? "In progress"
      : status === "REVIEW"
        ? "Review"
        : "To do";

export default function RecentTasks({
  tasks,
}: {
  tasks: Task[];
}) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            Tasks
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Latest activity
          </h2>
        </div>

        <Link
          href="/tasks"
          className="text-sm font-medium text-[rgb(var(--primary))]"
        >
          View all
        </Link>
      </div>

      <div className="mt-5 divide-y divide-[rgb(var(--border))]">
        {tasks.length ? (
          tasks.map((task) => (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-center gap-3 py-3 transition hover:bg-[rgb(var(--surface-muted)/0.25)] first:pt-0 last:pb-0"
            >
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                  task.status ===
                  "DONE"
                    ? "bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]"
                    : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]",
                ].join(" ")}
              >
                {task.status ===
                "DONE" ? (
                  <CircleCheck
                    size={17}
                  />
                ) : (
                  <Clock3
                    size={17}
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {task.title}
                </span>

                <span className="mt-0.5 block truncate text-xs text-[rgb(var(--muted))]">
                  {task.project
                    ?.title ||
                    "No project"}{" "}
                  ·{" "}
                  {statusLabel(
                    task.status
                  )}
                </span>
              </span>

              <ArrowRight
                size={15}
                className="shrink-0 text-[rgb(var(--muted))]"
              />
            </Link>
          ))
        ) : (
          <p className="py-8 text-sm text-[rgb(var(--muted))]">
            No tasks yet.
          </p>
        )}
      </div>
    </section>
  );
}