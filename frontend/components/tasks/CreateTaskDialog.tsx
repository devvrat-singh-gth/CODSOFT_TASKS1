"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createTask,
  getAssignableUsers,
} from "@/services/api";

import {
  toast,
} from "sonner";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import type {
  Project,
} from "@/types/project";

import type {
  Priority,
  TaskAssignee,
  TaskStatus,
} from "@/types/task";

export default function CreateTaskDialog({
  open,
  onClose,
  onCreated,
  projects,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  projects: Project[];
  projectId?: string;
}) {
  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(
    projectId ||
      projects[0]?.id ||
      ""
  );

  const [
    priority,
    setPriority,
  ] = useState<Priority>(
    "MEDIUM"
  );

  const [
    status,
    setStatus,
  ] = useState<TaskStatus>(
    "TODO"
  );

  const [
    dueDate,
    setDueDate,
  ] = useState("");
const [
  dueDateError,
  setDueDateError,
] = useState(false);
  const [
    assignee,
    setAssignee,
  ] = useState("");

  const [
    users,
    setUsers,
  ] = useState<TaskAssignee[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedProject(
      projectId ||
        projects[0]?.id ||
        ""
    );

    void getAssignableUsers()
      .then(setUsers)
      .catch(() =>
        setUsers([])
      );
  }, [
    open,
    projectId,
    projects,
  ]);

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (
      !trimmedTitle ||
      !selectedProject
    ) {
      toast.error(
        "Task title and project are required."
      );
      return;
    }
if (!dueDate) {
  setDueDateError(true);

  toast.error(
    "Please select a due date."
  );

  return;
}

setDueDateError(false);
    setLoading(true);

    try {
      await createTask({
        title: trimmedTitle,
        description:
          description.trim() ||
          null,
        projectId:
          selectedProject,
        priority,
        status,
        dueDate: dueDate
          ? new Date(
              `${dueDate}T23:59:59`
            ).toISOString()
          : null,
        assignedToId:
          assignee || null,
      });

      toast.success(
        "Task created"
      );

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus("TODO");
      setDueDate("");
      setDueDateError(false);
      setAssignee("");

      onClose();
      onCreated();
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Unable to create task."
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <Dialog
    open={open}
    onClose={onClose}
    title="Create a task"
    description="Turn a project goal into a clear next action."
  >
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="create-task-title"
          className="block text-sm font-medium"
        >
          Task title
        </label>

        <Input
          id="create-task-title"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          maxLength={200}
          placeholder="e.g. Finalize homepage copy"
          autoFocus
        />
      </div>

      <Select
        label="Project"
        value={selectedProject}
        onChange={(event) =>
          setSelectedProject(
            event.target.value
          )
        }
        options={[
          {
            value: "",
            label: "Select project",
          },
          ...projects.map(
            (project) => ({
              value: project.id,
              label: project.title,
            })
          ),
        ]}
      />

      <div className="space-y-2">
        <label
          htmlFor="create-task-description"
          className="block text-sm font-medium"
        >
          Description
        </label>

        <Textarea
          id="create-task-description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          rows={4}
          maxLength={2000}
          placeholder="Add useful context..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as TaskStatus
            )
          }
          options={[
            {
              value: "TODO",
              label: "To do",
            },
            {
              value: "IN_PROGRESS",
              label: "In progress",
            },
            {
              value: "REVIEW",
              label: "Review",
            },
            {
              value: "DONE",
              label: "Done",
            },
          ]}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(event) =>
            setPriority(
              event.target.value as Priority
            )
          }
          options={[
            {
              value: "LOW",
              label: "Low",
            },
            {
              value: "MEDIUM",
              label: "Medium",
            },
            {
              value: "HIGH",
              label: "High",
            },
            {
              value: "URGENT",
              label: "Urgent",
            },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="create-task-due-date"
            className="block text-sm font-medium"
          >
            Due date
          </label>

          <Input
            id="create-task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(
                event.target.value
              );

              if (
                event.target.value
              ) {
                setDueDateError(
                  false
                );
              }
            }}
            className={
              dueDateError
                ? "border-red-500"
                : ""
            }
          />

          {dueDateError && (
            <p className="mt-1 text-xs text-red-500">
              Due date is required.
            </p>
          )}
        </div>

        <Select
          label="Assignee"
          value={assignee}
          onChange={(event) =>
            setAssignee(
              event.target.value
            )
          }
          options={[
            {
              value: "",
              label: "Unassigned",
            },
            ...users.map(
              (user) => ({
                value: user.id,
                label: user.name,
              })
            ),
          ]}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          type="submit"
        >
          Create task
        </Button>
      </div>
    </form>
  </Dialog>
);
}