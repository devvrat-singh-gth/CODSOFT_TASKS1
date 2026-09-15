"use client";

import {
  useEffect,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import type {
  Project,
  ProjectInput,
} from "@/types/project";

export default function ProjectForm({
  initial,
  onCancel,
  onSubmit,
  loading = false,
}: {
  initial?: Partial<Project>;
  onCancel: () => void;
  onSubmit: (
    payload: ProjectInput
  ) => Promise<void> | void;
  loading?: boolean;
}) {
  const [title, setTitle] =
    useState(
      initial?.title || ""
    );

  const [description, setDescription] =
    useState(
      initial?.description || ""
    );

  const [error, setError] =
    useState("");

  useEffect(() => {
    setTitle(
      initial?.title || ""
    );

    setDescription(
      initial?.description || ""
    );

    setError("");
  }, [
    initial?.id,
    initial?.title,
    initial?.description,
  ]);

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      setError(
        "Project title is required."
      );
      return;
    }

    setError("");

    await onSubmit({
      title: trimmedTitle,
      description:
        description.trim() ||
        null,
    });
  };

  const editing =
    Boolean(initial?.id);

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="project-title"
          className="mb-2 block text-sm font-medium"
        >
          Project title
        </label>

        <Input
          id="project-title"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          maxLength={200}
          placeholder="e.g. Website redesign"
          autoFocus
          aria-invalid={Boolean(
            error
          )}
        />

        <p className="mt-1 text-right text-[11px] text-[rgb(var(--muted))]">
          {title.length}/200
        </p>
      </div>

      <div>
        <label
          htmlFor="project-description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <Textarea
          id="project-description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          maxLength={2000}
          rows={5}
          placeholder="What is this project trying to accomplish?"
        />

        <p className="mt-1 text-right text-[11px] text-[rgb(var(--muted))]">
          {description.length}/2000
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-[rgb(var(--danger))]"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          type="submit"
        >
          {editing
            ? "Save changes"
            : "Create project"}
        </Button>
      </div>
    </form>
  );
}