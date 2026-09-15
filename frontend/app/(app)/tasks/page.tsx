"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ListTodo,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import TaskSearch from "@/components/tasks/TaskSearch";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskList from "@/components/tasks/TaskList";
import TaskTable from "@/components/tasks/TaskTable";
import TaskEmptyState from "@/components/tasks/TaskEmptyState";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";

import {
  getProjects,
  getTasks,
  updateTask,
} from "@/services/api";

import type { Project } from "@/types/project";

import type {
  Priority,
  Task,
  TaskStatus,
} from "@/types/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<TaskStatus | "ALL">("ALL");

  const [priority, setPriority] =
    useState<Priority | "ALL">("ALL");

  const [createOpen, setCreateOpen] = useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deletingTask, setDeletingTask] =
    useState<Task | null>(null);

  const loadData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        }

        const [
          taskResponse,
          projectResponse,
        ] = await Promise.all([
          getTasks(1, 100),
          getProjects(1, 100),
        ]);

        setTasks(taskResponse.data);
        setProjects(projectResponse.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to load tasks."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredTasks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title
          .toLowerCase()
          .includes(query) ||
        Boolean(
          task.description
            ?.toLowerCase()
            .includes(query)
        );

      const matchesStatus =
        status === "ALL" ||
        task.status === status;

      const matchesPriority =
        priority === "ALL" ||
        task.priority === priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    status,
    priority,
  ]);

  const hasFilters =
    Boolean(search.trim()) ||
    status !== "ALL" ||
    priority !== "ALL";

  const handleStatusChange = async (
    task: Task,
    nextStatus: TaskStatus
  ) => {
    if (task.status === nextStatus) {
      return;
    }

    try {
      await updateTask(task.id, {
        status: nextStatus,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );

      toast.success(
        "Task status updated"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

if (loading) {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-full lg:w-80" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <Skeleton
                key={index}
                className="h-28 rounded-2xl"
              />
            )
          )}
        </div>
      </div>
    </PageContainer>
  );
}

  return (
    <PageContainer>
      <Reveal>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[rgb(var(--primary))]">
                <ListTodo size={17} />

                <span className="text-xs font-semibold uppercase tracking-[.18em]">
                  Workspace
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Tasks
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
                Keep every action visible,
                prioritized, and moving toward
                completion.
              </p>
            </div>

            <Button
              onClick={() =>
                setCreateOpen(true)
              }
              size="md"
            >
              <Plus size={17} />
              New task
            </Button>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <TaskSearch
              value={search}
              onChange={setSearch}
            />

            <TaskFilters
              status={status}
              priority={priority}
              onStatus={setStatus}
              onPriority={setPriority}
            />
          </div>

          {refreshing ? (
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
              <Spinner size="sm" />
              Refreshing tasks...
            </div>
          ) : null}
        </div>
      </Reveal>

      <div className="mt-8">
        {filteredTasks.length === 0 ? (
          <Reveal>
            <TaskEmptyState
              filtered={hasFilters}
              onCreate={() => {
                if (hasFilters) {
                  setSearch("");
                  setStatus("ALL");
                  setPriority("ALL");
                } else {
                  setCreateOpen(true);
                }
              }}
            />
          </Reveal>
        ) : (
          <>
            <Reveal>
              <TaskList
                tasks={filteredTasks}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
                onStatusChange={
                  handleStatusChange
                }
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="hidden lg:block">
<TaskTable
  tasks={filteredTasks}
  onEdit={setEditingTask}
  onDelete={setDeletingTask}
/>
              </div>
            </Reveal>
          </>
        )}
      </div>

      <CreateTaskDialog
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onCreated={() =>
          void loadData(true)
        }
        projects={projects}
      />

      <EditTaskDialog
        task={editingTask}
        onClose={() =>
          setEditingTask(null)
        }
        onUpdated={() =>
          void loadData(true)
        }
      />

      <DeleteTaskDialog
        task={deletingTask}
        onClose={() =>
          setDeletingTask(null)
        }
        onDeleted={() =>
          void loadData(true)
        }
      />
    </PageContainer>
  );
}