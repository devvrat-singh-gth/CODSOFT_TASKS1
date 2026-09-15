"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Bell,
  CheckCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/api";

import type {
  Notification,
} from "@/types/notification";

import NotificationItem from "./NotificationItem";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (
    count: number
  ) => void;
}

export default function NotificationDrawer({
  open,
  onClose,
  onUnreadChange,
}: NotificationDrawerProps) {
  const router = useRouter();

  const drawerRef =
    useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    const loadNotifications =
      async () => {
        try {
          setLoading(true);

          const response =
            await getNotifications(
              1,
              20
            );

          setNotifications(
            response.data
          );

          onUnreadChange?.(
            response.data.filter(
              (item) =>
                item.readAt === null
            ).length
          );
        } catch {
          // Axios interceptor handles auth failures.
        } finally {
          setLoading(false);
        }
      };

    void loadNotifications();
  }, [open, onUnreadChange]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        drawerRef.current &&
        !drawerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

const updateUnreadCount = (
  nextItems: Notification[]
) => {
  const count = nextItems.filter(
    (item) => item.readAt === null
  ).length;

  queueMicrotask(() => {
    onUnreadChange?.(count);
  });
};

  const handleNotificationClick =
    async (
      notification: Notification
    ) => {
      try {
        if (!notification.readAt) {
          await markNotificationRead(
            notification.id
          );

          setNotifications((current) => {
            const next = current.map(
              (item) =>
                item.id === notification.id
                  ? {
                      ...item,
                      readAt:
                        new Date().toISOString(),
                    }
                  : item
            );

            updateUnreadCount(next);
            return next;
          });
        }
      } catch {
        return;
      }

      onClose();

if (notification.projectId) {
  router.push(
    `/projects/${notification.projectId}`
  );
  return;
}

router.push("/tasks");
    };

  const handleMarkRead = async (
    notificationId: string
  ) => {
    try {
      await markNotificationRead(
        notificationId
      );

      setNotifications((current) => {
        const next = current.map(
          (item) =>
            item.id === notificationId
              ? {
                  ...item,
                  readAt:
                    new Date().toISOString(),
                }
              : item
        );

        updateUnreadCount(next);
        return next;
      });
    } catch {
      // Keep current UI state on failure.
    }
  };

  const handleMarkAllRead = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      await markAllNotificationsRead();

      setNotifications((current) => {
        const next = current.map(
          (item) => ({
            ...item,
            readAt:
              item.readAt ??
              new Date().toISOString(),
          })
        );

        updateUnreadCount(next);
        return next;
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (
    notificationId: string
  ) => {
    try {
      await deleteNotification(
        notificationId
      );

      setNotifications((current) => {
        const next = current.filter(
          (item) =>
            item.id !== notificationId
        );

        updateUnreadCount(next);
        return next;
      });
    } catch {
      // Keep item visible when deletion fails.
    }
  };

  const unreadCount =
    notifications.filter(
      (item) => item.readAt === null
    ).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            ref={drawerRef}
            className="fixed right-3 top-[84px] z-50 flex h-[calc(100vh-96px)] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-2xl shadow-black/15 sm:right-5 sm:top-[88px] sm:h-[calc(100vh-108px)] lg:right-6"
            initial={{
              opacity: 0,
              x: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgb(var(--primary)/0.10)] text-[rgb(var(--primary))]">
                  <Bell size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Notifications
                  </h2>

                  <p className="text-xs text-[rgb(var(--muted))]">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You're all caught up"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={
                      handleMarkAllRead
                    }
                    disabled={actionLoading}
                    title="Mark all as read"
                    className="grid h-9 w-9 place-items-center rounded-xl text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))] disabled:opacity-50"
                  >
                    <CheckCheck size={17} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close notifications"
                  className="grid h-9 w-9 place-items-center rounded-xl text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
                  <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
                  <div className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
                </div>
              ) : notifications.length ===
                0 ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center px-6 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]">
                    <Bell size={23} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    No notifications
                  </h3>

                  <p className="mt-1 max-w-xs text-sm leading-5 text-[rgb(var(--muted))]">
                    New task assignments and
                    deadline reminders will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(
                    (notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={
                          notification
                        }
                        onClick={
                          handleNotificationClick
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

            <div className="border-t border-[rgb(var(--border))] px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(
                    "/notifications"
                  );
                }}
                className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--primary)/0.08)]"
              >
                View all notifications
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}