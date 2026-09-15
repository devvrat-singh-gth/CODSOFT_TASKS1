import Progress from "@/components/ui/Progress";

import type {
  DashboardStats,
} from "@/types/dashboard";

export default function TaskProgress({
  data,
}: {
  data: DashboardStats;
}) {
  const items = [
    [
      "To do",
      data.taskStatus.todo,
    ],
    [
      "In progress",
      data.taskStatus.inProgress,
    ],
    [
      "Review",
      data.taskStatus.review,
    ],
    [
      "Done",
      data.taskStatus.done,
    ],
  ] as const;

  const total =
    data.tasks;

  return (
    <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Task flow
        </p>

        <h2 className="mt-1 text-lg font-semibold">
          Where work stands
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {items.map(
          ([label, value]) => {
            const percentage =
              total > 0
                ? Math.round(
                    (value / total) *
                      100
                  )
                : 0;

            return (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span>
                    {label}
                  </span>

                  <span className="shrink-0 text-[rgb(var(--muted))]">
                    {value} · {percentage}%
                  </span>
                </div>

                <Progress
                  value={percentage}
                />
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}