import type {
  Task,
} from "@/types/task";

import PriorityBadge from "./PriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";
import DueDateBadge from "./DueDateBadge";

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onEdit: (
    task: Task
  ) => void;
  onDelete: (
    task: Task
  ) => void;
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] lg:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-[rgb(var(--surface-muted)/0.55)] text-xs uppercase tracking-wider text-[rgb(var(--muted))]">
          <tr>
            <th className="px-5 py-4 font-medium">
              Task
            </th>

            <th className="px-5 py-4 font-medium">
              Project
            </th>

            <th className="px-5 py-4 font-medium">
              Status
            </th>

            <th className="px-5 py-4 font-medium">
              Priority
            </th>

            <th className="px-5 py-4 font-medium">
              Due
            </th>

            <th className="px-5 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-[rgb(var(--border))]">
          {tasks.map(
            (task) => (
              <tr
                key={task.id}
                className="transition hover:bg-[rgb(var(--surface-muted)/0.35)]"
              >
                <td className="max-w-sm px-5 py-4">
                  <p className="truncate font-medium">
                    {task.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[rgb(var(--muted))]">
                    {task.description ||
                      "No description"}
                  </p>
                </td>

                <td className="px-5 py-4 text-[rgb(var(--muted))]">
                  {task.project?.title ||
                    "No project"}
                </td>

                <td className="px-5 py-4">
                  <TaskStatusBadge
                    status={task.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <PriorityBadge
                    priority={task.priority}
                  />
                </td>

                <td className="px-5 py-4">
                  <DueDateBadge
                    date={task.dueDate}
                    status={task.status}
                  />
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(task)
                    }
                    className="mr-3 text-xs font-semibold text-[rgb(var(--primary))]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(task)
                    }
                    className="text-xs font-semibold text-[rgb(var(--danger))]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}