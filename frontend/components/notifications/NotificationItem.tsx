"use client";

import {
  Check,
  Trash2,
  Plus,
  Pencil,
  UserPlus,
  CheckCircle2,
  RefreshCw,
  Clock3,
  AlertTriangle,
  FolderKanban,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import type {
  Notification,
} from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: (
    notification: Notification
  ) => void;
  onMarkRead: (
    notificationId: string
  ) => void;
  onDelete: (
    notificationId: string
  ) => void;
}
function getNotificationIcon(
  type: Notification["type"]
) {
  switch (type) {

    case "TASK_CREATED":
      return <Plus size={16} />;

    case "TASK_UPDATED":
      return (
        <Pencil size={16} />
      );

    case "TASK_DELETED":
      return (
        <Trash2 size={16} />
      );

    case "TASK_ASSIGNED":
      return (
        <UserPlus size={16} />
      );

    case "TASK_COMPLETED":
      return (
        <CheckCircle2 size={16} />
      );

    case "TASK_STATUS_CHANGED":
      return (
        <RefreshCw size={16} />
      );

    case "TASK_DUE_SOON":
      return <Clock3 size={16} />;

    case "TASK_OVERDUE":
      return (
        <AlertTriangle size={16} />
      );

    default:
      return "•";
  }
}

export default function NotificationItem({
  notification,
  onClick,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const unread =
    notification.readAt === null;

  const timestamp =
    formatDistanceToNow(
      new Date(notification.createdAt),
      {
        addSuffix: true,
      }
    );

  return (
    <article
      className={[
        "group relative rounded-2xl border",
        "p-4",
        "transition-all duration-200",
        unread
          ? [
              "border-[rgb(var(--primary)/0.25)]",
              "bg-[rgb(var(--primary)/0.06)]",
              "shadow-[0_0_20px_rgb(var(--primary)/0.10)]",
            ].join(" ")
          : [
              "border-[rgb(var(--border))]",
              "bg-[rgb(var(--surface))]",
            ].join(" "),
        "hover:-translate-y-0.5",
        "hover:bg-[rgb(var(--surface-muted)/0.7)]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onClick(notification)}
        className="w-full pr-14 text-left outline-none"
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold",
              unread
                ? "bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]"
                : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]",
            ].join(" ")}
            aria-hidden="true"
          >
            {getNotificationIcon(
              notification.type
            )}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-[rgb(var(--foreground))]">
                {notification.title}
              </h3>

              {unread && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--primary))] shadow-[0_0_10px_rgb(var(--primary)/0.75)]"
                  aria-label="Unread"
                />
              )}
            </div>

            <p className="mt-1 text-sm leading-5 text-[rgb(var(--muted))]">
              {notification.message}
            </p>

            <p className="mt-2 text-xs text-[rgb(var(--muted))]">
              {timestamp}
            </p>
          </div>
        </div>
      </button>

      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        {unread && (
          <button
            type="button"
            aria-label="Mark notification as read"
            title="Mark as read"
            onClick={() =>
              onMarkRead(notification.id)
            }
            className="grid h-8 w-8 place-items-center rounded-lg text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
          >
            <Check size={15} />
          </button>
        )}

        <button
          type="button"
          aria-label="Delete notification"
          title="Delete notification"
          onClick={() =>
            onDelete(notification.id)
          }
          className="grid h-8 w-8 place-items-center rounded-lg text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--danger)/0.08)] hover:text-[rgb(var(--danger))]"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}