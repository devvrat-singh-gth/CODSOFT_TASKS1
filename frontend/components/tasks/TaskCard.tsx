"use client";

import {
  MoreHorizontal,
} from "lucide-react";

import Dropdown from "@/components/ui/Dropdown";

import type {
  Task,
} from "@/types/task";

import PriorityBadge from "./PriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";
import DueDateBadge from "./DueDateBadge";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (
    status: Task["status"]
  ) => void;
}) {
  return (
    <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge
              status={task.status}
            />

            <PriorityBadge
              priority={task.priority}
            />
          </div>

          <h3 className="mt-3 truncate font-semibold">
            {task.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[rgb(var(--muted))]">
            {task.description ||
              "No description added."}
          </p>
        </div>

        <Dropdown
          trigger={
            <button
              type="button"
              aria-label="Task actions"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-muted))]"
            >
              <MoreHorizontal
                size={18}
              />
            </button>
          }
        >
          <button
            type="button"
            onClick={onEdit}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[rgb(var(--surface-muted))]"
          >
            Edit task
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger)/0.08)]"
          >
            Delete
          </button>
        </Dropdown>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[rgb(var(--border))] pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="min-w-0 truncate text-[rgb(var(--muted))]">
          {task.project?.title ||
            "No project"}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <DueDateBadge
            date={task.dueDate}
            status={task.status}
          />

          <select
            aria-label={`Change status for ${task.title}`}
            value={task.status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as Task["status"]
              )
            }
            className="h-8 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2 text-xs outline-none focus:border-[rgb(var(--primary)/0.7)] focus:ring-2 focus:ring-[rgb(var(--primary)/0.1)]"
          >
            <option value="TODO">
              To do
            </option>

            <option value="IN_PROGRESS">
              In progress
            </option>

            <option value="REVIEW">
              Review
            </option>

            <option value="DONE">
              Done
            </option>
          </select>
        </div>
      </div>
    </article>
  );
}