"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAssignableUsers,
  updateTask,
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
  Priority,
  Task,
  TaskAssignee,
  TaskStatus,
} from "@/types/task";

export default function EditTaskDialog({
  task,
  onClose,
  onUpdated,
}: {
  task: Task | null;
  onClose: () => void;
  onUpdated: () => void;
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
    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(
      task.description || ""
    );
    setPriority(task.priority);
    setStatus(task.status);
    setAssignee(
      task.assignedToId || ""
    );
    setDueDate(
      task.dueDate
        ? new Date(
            task.dueDate
          )
            .toISOString()
            .slice(0, 10)
        : ""
    );

    void getAssignableUsers()
      .then(setUsers)
      .catch(() =>
        setUsers([])
      );
  }, [task?.id]);

  if (!task) {
    return null;
  }

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      toast.error(
        "Task title is required."
      );
      return;
    }

    setLoading(true);

    try {
      await updateTask(
        task.id,
        {
          title: trimmedTitle,
          description:
            description.trim() ||
            null,
          priority,
          status,
          dueDate: dueDate
            ? new Date(
                `${dueDate}T23:59:59`
              ).toISOString()
            : null,
          assignedToId:
            assignee || null,
        }
      );

      toast.success(
        "Task updated"
      );

      onClose();
      onUpdated();
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Unable to update task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={Boolean(task)}
      onClose={onClose}
      title="Edit task"
      description="Update the task without losing its project context."
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label
            htmlFor="edit-task-title"
            className="block text-sm font-medium"
          >
            Task title
          </label>

          <Input
            id="edit-task-title"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-task-description"
            className="block text-sm font-medium"
          >
            Description
          </label>

          <Textarea
            id="edit-task-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={4}
            maxLength={2000}
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
                value:
                  "IN_PROGRESS",
                label:
                  "In progress",
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
              htmlFor="edit-task-due-date"
              className="block text-sm font-medium"
            >
              Due date
            </label>

            <Input
              id="edit-task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
            />
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
                label:
                  "Unassigned",
              },
              ...users.map(
                (user) => ({
                  value:
                    user.id,
                  label:
                    user.name,
                })
              ),
            ]}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}