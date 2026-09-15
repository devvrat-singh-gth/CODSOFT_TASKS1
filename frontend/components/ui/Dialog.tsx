"use client";

import {
  X,
} from "lucide-react";

import Modal from "./Modal";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className = "",
}: DialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={className}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={
          description
            ? "dialog-description"
            : undefined
        }
        className="overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[rgb(var(--border))] px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2
              id="dialog-title"
              className="text-lg font-semibold tracking-tight"
            >
              {title}
            </h2>

            {description && (
              <p
                id="dialog-description"
                className="mt-1 max-w-xl text-sm leading-5 text-[rgb(var(--muted))]"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </Modal>
  );
}