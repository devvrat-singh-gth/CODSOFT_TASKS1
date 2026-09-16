"use client";

import { motion } from "framer-motion";
import {
  useMemo,
  useEffect,
  useState,
} from "react";
import { useTheme } from "next-themes";
import {
  CalendarDays,
  Monitor,
  Moon,
  Sun,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
  Bell,
  Volume2,
  Clock3,
} from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";

import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/services/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const { theme, setTheme } = useTheme();

  const initials = useMemo(() => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }, [user?.name]);

  type NotificationSettings = {
    dueSoonNotifications: boolean;
    overdueNotifications: boolean;
    assignmentNotifications: boolean;
    statusNotifications: boolean;
    browserPopups: boolean;
    notificationSound: boolean;
    notificationRetentionDays: number;
  };

  const [
    notificationSettings,
    setNotificationSettings,
  ] = useState<NotificationSettings>({
    dueSoonNotifications: true,
    overdueNotifications: true,
    assignmentNotifications: true,
    statusNotifications: true,
    browserPopups: true,
    notificationSound: true,
    notificationRetentionDays: 90,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response =
          await getNotificationSettings();

        if (response?.data) {
          setNotificationSettings(
            response.data
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadSettings();
  }, []);

  const saveSettings = async (
    updatedSettings: NotificationSettings
  ) => {
    try {
      setSaving(true);

      setNotificationSettings(
        updatedSettings
      );

      await updateNotificationSettings(
        updatedSettings
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-5">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-[rgb(var(--surface-muted))]" />
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div className="h-72 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
            <div className="h-72 animate-pulse rounded-2xl bg-[rgb(var(--surface-muted))]" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <UserRound
            size={32}
            className="mx-auto text-[rgb(var(--muted))]"
          />

          <h1 className="mt-4 text-xl font-semibold">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
            We could not load your account information.
          </p>
        </Card>
      </PageContainer>
    );
  }

  const notificationOptions: {
    key: keyof Omit<
      NotificationSettings,
      "notificationRetentionDays"
    >;
    label: string;
    description: string;
    icon: typeof Bell;
  }[] = [
    {
      key: "dueSoonNotifications",
      label: "Due Soon Alerts",
      description:
        "Receive reminders when tasks are approaching their deadline.",
      icon: Clock3,
    },
    {
      key: "overdueNotifications",
      label: "Overdue Alerts",
      description:
        "Notify you when an unfinished task passes its deadline.",
      icon: Clock3,
    },
    {
      key: "assignmentNotifications",
      label: "Task Assignments",
      description:
        "Notify you when a task is assigned to you.",
      icon: UserRound,
    },
    {
      key: "statusNotifications",
      label: "Status Updates",
      description:
        "Notify you when assigned task status changes.",
      icon: Bell,
    },
    {
      key: "browserPopups",
      label: "Browser Popups",
      description:
        "Show a notification popup when a new alert arrives.",
      icon: Bell,
    },
    {
      key: "notificationSound",
      label: "Notification Sounds",
      description:
        "Play a short sound when a new notification arrives.",
      icon: Volume2,
    },
  ];

  const retentionOptions = [
    {
      value: 1,
      label: "24 hours",
    },
    {
      value: 7,
      label: "1 week",
    },
    {
      value: 30,
      label: "30 days",
    },
    {
      value: 90,
      label: "90 days",
    },
  ];

  return (
    <PageContainer>
      <Reveal>
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-[rgb(var(--primary))]">
            <UserRound size={17} />

            <span className="text-xs font-semibold uppercase tracking-[.18em]">
              Account
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
            Manage your account, appearance,
            and notification preferences.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
        <Reveal>
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[rgb(var(--primary)/.18)] via-[rgb(var(--primary)/.08)] to-transparent" />

            <div className="-mt-10 px-5 pb-6 sm:px-6">
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={initials}
                size="xl"
              />

              <div className="mt-4 min-w-0">
                <h2 className="truncate text-xl font-semibold">
                  {user.name}
                </h2>

                <p className="mt-1 break-all text-sm text-[rgb(var(--muted))]">
                  {user.email}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="success">
                  <ShieldCheck size={13} />
                  Active account
                </Badge>

                <Badge variant="neutral">
                  <KeyRound size={13} />
                  Authenticated
                </Badge>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.05}>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
                <UserRound size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold">
                  Account information
                </h2>

                <p className="text-xs text-[rgb(var(--muted))]">
                  Your current WorkOrbit account details
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-[rgb(var(--border))]">
              <div className="flex items-start gap-4 py-4 first:pt-0">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[rgb(var(--muted))]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4">
                <UserRound
                  size={18}
                  className="mt-0.5 shrink-0 text-[rgb(var(--muted))]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
                    Display name
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4 pb-0">
                <CalendarDays
                  size={18}
                  className="mt-0.5 shrink-0 text-[rgb(var(--muted))]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
                    Account status
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Active
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[rgb(var(--muted))]">
                    Your account is ready to use
                    across your projects and tasks.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <Card className="mt-5 p-5 sm:p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
                <Sun size={18} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Appearance
                </h2>

                <p className="text-xs text-[rgb(var(--muted))]">
                  Choose how WorkOrbit appears on
                  your device.
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              {
                value: "light",
                label: "Light",
                description: "Bright interface",
                icon: Sun,
              },
              {
                value: "dark",
                label: "Dark",
                description: "Low-light interface",
                icon: Moon,
              },
              {
                value: "system",
                label: "System",
                description: "Follow device",
                icon: Monitor,
              },
            ].map(
              ({
                value,
                label,
                description,
                icon: Icon,
              }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setTheme(value)
                  }
                  className={[
                    "group relative min-h-20 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
                    "hover:-translate-y-0.5",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgb(var(--primary)/.14)]",
                    theme === value
                      ? "border-[rgb(var(--primary)/.45)] bg-[rgb(var(--primary)/.10)] shadow-[0_10px_28px_rgb(var(--primary)/.10)]"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:bg-[rgb(var(--surface-muted)/.65)]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                        theme === value
                          ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                          : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]",
                      ].join(" ")}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={[
                          "text-sm font-semibold",
                          theme === value
                            ? "text-[rgb(var(--foreground))]"
                            : "",
                        ].join(" ")}
                      >
                        {label}
                      </p>

                      <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">
                        {description}
                      </p>
                    </div>

                    {theme === value && (
                      <motion.span
                        layoutId="theme-active-dot"
                        className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-[rgb(var(--primary))] shadow-[0_0_12px_rgb(var(--primary)/.65)]"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 32,
                        }}
                      />
                    )}
                  </div>
                </button>
              )
            )}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.12}>
        <Card className="mt-5 p-5 sm:p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
                <Bell
                  size={18}
                  className="text-[rgb(var(--primary))]"
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  Notifications
                </h2>

                <p className="text-xs text-[rgb(var(--muted))]">
                  Control which alerts WorkOrbit
                  generates and how they are presented.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {notificationOptions.map(
              ({
                key,
                label,
                description,
                icon: Icon,
              }) => {
                const enabled =
                  notificationSettings[key];

                return (
                  <div
                    key={key}
                    className="flex items-center gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 transition-colors hover:bg-[rgb(var(--surface-muted)/.45)]"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--surface-muted))] text-[rgb(var(--muted))]">
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {label}
                      </p>

                      <p className="mt-0.5 max-w-2xl text-xs leading-5 text-[rgb(var(--muted))]">
                        {description}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      aria-label={`Toggle ${label}`}
                      disabled={saving}
                      onClick={() =>
                        void saveSettings({
                          ...notificationSettings,
                          [key]: !enabled,
                        })
                      }
                      className={[
                        "relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgb(var(--primary)/.14)]",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        enabled
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-[rgb(var(--surface-muted))] ring-1 ring-[rgb(var(--border))]",
                      ].join(" ")}
                    >
                      <motion.span
                        animate={{
                          x: enabled ? 20 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 32,
                        }}
                        className="block h-5 w-5 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-muted)/.35)] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
                  <Clock3 size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Auto-delete notifications
                  </p>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-[rgb(var(--muted))]">
                    Older notifications are removed
                    automatically after the selected
                    retention period.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-52">
                <label
                  htmlFor="notification-retention"
                  className="sr-only"
                >
                  Notification retention period
                </label>

                <div className="relative">
                  <select
                    id="notification-retention"
                    value={
                      notificationSettings.notificationRetentionDays
                    }
                    disabled={saving}
                    onChange={(event) =>
                      void saveSettings({
                        ...notificationSettings,
                        notificationRetentionDays:
                          Number(event.target.value),
                      })
                    }
                    className="
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-[rgb(var(--border))]
                      bg-[rgb(var(--surface))]
                      px-4
                      py-3
                      pr-10
                      text-sm
                      font-medium
                      text-[rgb(var(--foreground))]
                      shadow-sm
                      outline-none
                      transition-all
                      hover:bg-[rgb(var(--surface-muted))]
                      focus:border-[rgb(var(--primary)/.45)]
                      focus:ring-4
                      focus:ring-[rgb(var(--primary)/.10)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {retentionOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-[rgb(var(--surface))] text-[rgb(var(--foreground))]"
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>

                  <div
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[rgb(var(--muted))]"
                    aria-hidden="true"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.16}>
        <Card className="mt-5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <h2 className="font-semibold">
                Profile ready
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
                Your identity is connected to WorkOrbit.
                You can create projects, manage tasks,
                assign work, customize notifications, and
                control the appearance of your workspace.
              </p>
            </div>
          </div>
        </Card>
      </Reveal>
    </PageContainer>
  );
}