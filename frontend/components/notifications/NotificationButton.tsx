"use client";

import {
  Bell,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getUnreadNotificationCount,
} from "@/services/api";

import {
  playNotificationSound,
} from "./NotificationSound";

import NotificationDrawer from "./NotificationDrawer";

const SOUND_TYPES = new Set([
  "TASK_ASSIGNED",
  "TASK_DUE_SOON",
  "TASK_OVERDUE",
]);

export default function NotificationButton() {
  const [open, setOpen] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const previousUnreadCount =
    useRef<number | null>(null);

  const knownCountRef =
    useRef<number | null>(null);

  const loadUnreadCount =
    useCallback(async () => {
      try {
        const count =
          await getUnreadNotificationCount();

        if (
          previousUnreadCount.current !==
            null &&
          count >
            previousUnreadCount.current &&
          knownCountRef.current !== count
        ) {
          playNotificationSound();
        }

        previousUnreadCount.current = count;
        knownCountRef.current = count;
        setUnreadCount(count);
      } catch {
        // Notification failures should not break the topbar.
      }
    }, []);

  useEffect(() => {
    void loadUnreadCount();

    const interval = window.setInterval(
      () => {
        void loadUnreadCount();
      },
      30_000
    );

    return () =>
      window.clearInterval(interval);
  }, [loadUnreadCount]);

  /*
   * Keep this callback stable so the drawer
   * can update the bell count after
   * read/delete actions.
   */
  const handleUnreadChange = useCallback(
    (count: number) => {
      previousUnreadCount.current =
        count;
      knownCountRef.current = count;
      setUnreadCount(count);
    },
    []
  );

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-label={`Notifications${
          unreadCount > 0
            ? `, ${unreadCount} unread`
            : ""
        }`}
        aria-expanded={open}
        title="Notifications"
        className={[
          "relative flex h-10 items-center gap-2 rounded-xl border px-2.5 text-sm",
          "transition-all duration-200",
          "outline-none",
          "focus-visible:ring-4 focus-visible:ring-[rgb(var(--primary)/0.14)]",
          unreadCount > 0
            ? [
                "border-[rgb(var(--primary)/0.35)]",
                "bg-[rgb(var(--primary)/0.07)]",
                "text-[rgb(var(--primary))]",
                "shadow-[0_0_18px_rgb(var(--primary)/0.14)]",
              ].join(" ")
            : [
                "border-[rgb(var(--border))]",
                "bg-[rgb(var(--surface))]",
                "text-[rgb(var(--foreground))]",
              ].join(" "),
          "hover:-translate-y-0.5",
          "hover:bg-[rgb(var(--surface-muted))]",
        ].join(" ")}
      >
       <div className="relative">
  <Bell size={20} />

  {unreadCount > 0 && (
    <span
      className="
        absolute
        -right-2.5
        -top-2
        flex
        h-5
        min-w-[20px]
        items-center
        justify-center
        rounded-full
        bg-[rgb(var(--primary))]
        px-1
        text-[10px]
        font-bold
        text-white
        shadow-[0_0_12px_rgb(var(--primary)/0.8)]
      "
    >
      {unreadCount > 99
        ? "99+"
        : unreadCount}
    </span>
  )}
</div>

        <span className="hidden pl-2 sm:block">
          Notifications
        </span>

      </button>

      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
        onUnreadChange={
          handleUnreadChange
        }
      />
    </>
  );
}