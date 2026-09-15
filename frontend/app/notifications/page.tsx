"use client";

import {
  CheckCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "@/services/api";

import type {
  Notification,
} from "@/types/notification";

import NotificationItem from "@/components/notifications/NotificationItem";

type Filter =
  | "all"
  | "unread";

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    filter,
    setFilter,
  ] = useState<Filter>("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadNotifications =
    async () => {
      try {
        setLoading(true);

        const response =
          await getNotifications(
            1,
            100,
            filter === "unread"
          );

        setNotifications(
          response.data
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadNotifications();
  }, [filter]);

  const unreadCount =
    notifications.filter(
      (item) =>
        item.readAt === null
    ).length;

  const handleClick =
    async (
      notification: Notification
    ) => {
      if (notification.readAt) {
        return;
      }

      await markNotificationRead(
        notification.id
      );

      setNotifications(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    readAt:
                      new Date().toISOString(),
                  }
                : item
          )
      );
    };

  const handleMarkRead =
    async (
      notificationId: string
    ) => {
      await markNotificationRead(
        notificationId
      );

      setNotifications(
        (current) =>
          current.map(
            (item) =>
              item.id === notificationId
                ? {
                    ...item,
                    readAt:
                      new Date().toISOString(),
                  }
                : item
          )
      );
    };

  const handleDelete =
    async (
      notificationId: string
    ) => {
      await deleteNotification(
        notificationId
      );

      setNotifications(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              notificationId
          )
      );
    };

  const handleMarkAllRead =
    async () => {
      if (unreadCount === 0) {
        return;
      }

      await markAllNotificationsRead();

      setNotifications(
        (current) =>
          current.map(
            (item) => ({
              ...item,
              readAt:
                item.readAt ??
                new Date().toISOString(),
            })
          )
      );
    };

  return (
    <main className="container-shell py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[rgb(var(--primary))]">
              Activity
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[rgb(var(--muted))]">
              Stay updated on assignments,
              task progress, and upcoming
              deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setFilter("all")
              }
              className={[
                "rounded-xl px-3.5 py-2 text-sm font-medium transition",
                filter === "all"
                  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                  : "bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-muted))]",
              ].join(" ")}
            >
              All
            </button>

            <button
              type="button"
              onClick={() =>
                setFilter("unread")
              }
              className={[
                "rounded-xl px-3.5 py-2 text-sm font-medium transition",
                filter === "unread"
                  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                  : "bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-muted))]",
              ].join(" ")}
            >
              Unread
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllRead
                }
                className="ml-1 inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3.5 py-2 text-sm font-medium transition hover:bg-[rgb(var(--surface-muted))]"
              >
                <CheckCheck
                  size={16}
                />
                <span className="hidden sm:inline">
                  Mark all read
                </span>
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
            <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
            <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
          </div>
        ) : notifications.length ===
          0 ? (
          <div className="rounded-3xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface)/0.65)] px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[rgb(var(--primary)/0.10)] text-[rgb(var(--primary))]">
              <CheckCheck
                size={23}
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[rgb(var(--muted))]">
              {filter === "unread"
                ? "You're all caught up."
                : "Notifications about assignments and deadlines will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {notifications.map(
              (notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={
                    notification
                  }
                  onClick={
                    handleClick
                  }
                  onMarkRead={
                    handleMarkRead
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}