"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import Spinner from "@/components/ui/Spinner";

import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectProgress from "@/components/projects/ProjectProgress";
import ProjectHeader from "@/components/projects/ProjectHeader";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import DeleteProjectDialog from "@/components/projects/DeleteProjectDialog";

import TaskList from "@/components/tasks/TaskList";
import TaskTable from "@/components/tasks/TaskTable";
import TaskEmptyState from "@/components/tasks/TaskEmptyState";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";

import {
  getProject,
  getProjects,
  getTasks,
  updateTask,
} from "@/services/api";

import type { Project } from "@/types/project";
import type { Task, TaskStatus } from "@/types/task";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [projectId, setProjectId] = useState("");

  const [project, setProject] =
    useState<Project | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [taskDialogOpen, setTaskDialogOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deletingTask, setDeletingTask] =
    useState<Task | null>(null);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null);

  useEffect(() => {
    void params.then(({ id }) => {
      setProjectId(id);
    });
  }, [params]);

  const loadData = useCallback(async () => {
    if (!projectId) {
      return;
    }

    try {
      setLoading(true);

      const [
        projectResponse,
        taskResponse,
        projectsResponse,
      ] = await Promise.all([
        getProject(projectId),
        getTasks(1, 100),
        getProjects(1, 100),
      ]);

      setProject(projectResponse);
setTasks(
  taskResponse.data.filter(
    (task) =>
      task.projectId === projectId
  )
);

setProjects(
  projectsResponse.data
);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to load this project."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      void loadData();
    }
  }, [projectId, loadData]);

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

      toast.success("Task status updated");
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <FolderKanban
            className="mx-auto text-[rgb(var(--muted))]"
            size={32}
          />

          <h1 className="mt-4 text-xl font-semibold">
            Project not found
          </h1>

          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            This project may have been deleted or you may no
            longer have access to it.
          </p>

          <Link href="/projects" className="mt-6 inline-flex">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Back to projects
            </Button>
          </Link>
        </Card>
      </PageContainer>
    );
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <PageContainer>
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))]"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>
      </Reveal>

      <div className="mt-6">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <ProjectStatusBadge
                  status={project.status}
                />
                <span className="text-xs text-[rgb(var(--muted))]">
                  {totalTasks}{" "}
                  {totalTasks === 1
                    ? "task"
                    : "tasks"}
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {project.title}
              </h1>

              {project.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
                  {project.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setEditingProject(project)
                }
              >
                Edit project
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  setDeletingProject(project)
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <Reveal>
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Project progress
                </p>

                <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Based on completed tasks
                </p>
              </div>

              <span className="text-2xl font-semibold">
                {progress}%
              </span>
            </div>

            <div className="mt-5">
              <Progress value={progress} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-[rgb(var(--surface-muted))] p-3">
                <p className="text-lg font-semibold">
                  {totalTasks}
                </p>
                <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Total
                </p>
              </div>

              <div className="rounded-xl bg-[rgb(var(--surface-muted))] p-3">
                <p className="text-lg font-semibold">
                  {completedTasks}
                </p>
                <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Done
                </p>
              </div>

              <div className="rounded-xl bg-[rgb(var(--surface-muted))] p-3">
                <p className="text-lg font-semibold">
                  {totalTasks - completedTasks}
                </p>
                <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Remaining
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.05}>
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <CalendarDays
                size={18}
                className="text-[rgb(var(--primary))]"
              />

              <div>
                <p className="text-sm font-medium">
                  Project status
                </p>

                <p className="text-xs text-[rgb(var(--muted))]">
                  Current workspace state
                </p>
              </div>
            </div>

            <ProjectStatusBadge
              status={project.status}
            />

            <div className="mt-5">
              <Button
                className="w-full"
                onClick={() =>
                  setTaskDialogOpen(true)
                }
              >
                <Plus size={16} />
                Add task
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListTodo
                size={18}
                className="text-[rgb(var(--primary))]"
              />

              <h2 className="text-xl font-semibold">
                Project tasks
              </h2>
            </div>

            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Manage the work items belonging to this project.
            </p>
          </div>

          {tasks.length > 0 ? (
            <Button
              size="sm"
              onClick={() =>
                setTaskDialogOpen(true)
              }
            >
              <Plus size={15} />
              Add task
            </Button>
          ) : null}
        </div>
      </Reveal>

      <div className="mt-5">
        {tasks.length === 0 ? (
          <TaskEmptyState
            filtered={false}
            onCreate={() =>
              setTaskDialogOpen(true)
            }
          />
        ) : (
          <>
            <div className="lg:hidden">
              <TaskList
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
                onStatusChange={
                  handleStatusChange
                }
              />
            </div>

            <div className="hidden lg:block">
<TaskTable
  tasks={tasks}
  onEdit={setEditingTask}
  onDelete={setDeletingTask}
/>
            </div>
          </>
        )}
      </div>

      <CreateTaskDialog
        open={taskDialogOpen}
        onClose={() =>
          setTaskDialogOpen(false)
        }
        onCreated={() => {
          setTaskDialogOpen(false);
          void loadData();
        }}
        projects={projects}
        projectId={project.id}
      />

      <EditTaskDialog
        task={editingTask}
        onClose={() =>
          setEditingTask(null)
        }
        onUpdated={() => {
          setEditingTask(null);
          void loadData();
        }}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onClose={() =>
          setDeletingTask(null)
        }
        onDeleted={() => {
          setDeletingTask(null);
          void loadData();
        }}
      />

      <EditProjectDialog
        project={editingProject}
        onClose={() =>
          setEditingProject(null)
        }
        onUpdated={() => {
          setEditingProject(null);
          void loadData();
        }}
      />

      <DeleteProjectDialog
        project={deletingProject}
        onClose={() =>
          setDeletingProject(null)
        }
        onDeleted={() => {
          setDeletingProject(null);
          window.location.href = "/projects";
        }}
      />
    </PageContainer>
  );
}