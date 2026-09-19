import Link from "next/link";

import {
  ArrowRight,
  FolderKanban,
} from "lucide-react";

import type {
  Project,
} from "@/types/project";

import Progress from "@/components/ui/Progress";

const statusLabel = (
  status: Project["status"]
) =>
  status === "IN_PROGRESS"
    ? "In progress"
    : status === "COMPLETED"
      ? "Completed"
      : "Planning";

export default function RecentProjects({
  projects,
}: {
  projects: Project[];
}) {
  return (
<section className="h-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            Projects
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Recent work
          </h2>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-[rgb(var(--primary))]"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {projects.length ? (
          projects.map(
            (project) => {
              const tasks =
                project.tasks ?? [];

              const done =
                tasks.filter(
                  (task) =>
                    task.status ===
                    "DONE"
                ).length;

              const percentage =
                tasks.length
                  ? Math.round(
                      (done /
                        tasks.length) *
                        100
                    )
                  : 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-xl border border-[rgb(var(--border))] p-4 transition hover:-translate-y-0.5 hover:bg-[rgb(var(--surface-muted)/0.45)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/0.09)] text-[rgb(var(--primary))]">
                      <FolderKanban size={18} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {project.title}
                        </p>

                        <span className="text-xs text-[rgb(var(--muted))]">
                          {statusLabel(
                            project.status
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <Progress
                          value={
                            percentage
                          }
                          className="flex-1"
                        />

                        <span className="w-10 shrink-0 text-right text-xs text-[rgb(var(--muted))]">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          )
        ) : (
          <p className="py-8 text-sm text-[rgb(var(--muted))]">
            No projects yet.
          </p>
        )}
      </div>
    </section>
  );
}