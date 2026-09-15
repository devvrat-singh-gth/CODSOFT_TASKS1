import Progress from "@/components/ui/Progress";
import type { Project } from "@/types/project";

export default function ProjectProgress({
  project,
}: {
  project: Project;
}) {
  const tasks = project.tasks ?? [];

  const done = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const pct = tasks.length
    ? Math.round((done / tasks.length) * 100)
    : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-[rgb(var(--muted))]">
        <span>
          {done}/{tasks.length} tasks complete
        </span>

        <span>{pct}%</span>
      </div>

      <Progress value={pct} />
    </div>
  );
}