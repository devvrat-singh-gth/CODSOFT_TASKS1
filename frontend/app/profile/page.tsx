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

const {
  theme,
  setTheme,
} = useTheme();

const [
  notificationSettings,
  setNotificationSettings,
] = useState({
  dueSoonNotifications: true,
  overdueNotifications: true,
  assignmentNotifications: true,
  statusNotifications: true,
  browserPopups: true,
  notificationSound: true,
  notificationRetentionDays: 90,
});

const [saving, setSaving] =
  useState(false);

useEffect(() => {
  const loadSettings =
    async () => {
      try {
        const response =
          await getNotificationSettings();

        if (
          response?.data
        ) {
          setNotificationSettings(
            response.data
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  loadSettings();
}, []);

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
const saveSettings =
  async (
    updatedSettings
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
            Manage your account information and authentication details.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[rgb(var(--primary)/.18)] via-[rgb(var(--primary)/.08)] to-transparent" />

            <div className="-mt-10 px-6 pb-6">
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={initials}
                size="xl"
              />

              <div className="mt-4">
                <h2 className="text-xl font-semibold">
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
  Account authenticated
</Badge>
              </div>
            </div>
          </Card>
        </Reveal>
<Reveal delay={0.08}>
  <Card className="mt-5 p-6">
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <Bell
          size={18}
          className="text-[rgb(var(--primary))]"
        />

        <h2 className="font-semibold">
          Notifications
        </h2>
      </div>

      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Configure notification behavior.
      </p>
    </div>

    <div className="space-y-4">
      {[
        {
          key:
            "dueSoonNotifications",
          label:
            "Due Soon Alerts",
        },
        {
          key:
            "overdueNotifications",
          label:
            "Overdue Alerts",
        },
        {
          key:
            "assignmentNotifications",
          label:
            "Task Assignments",
        },
        {
          key:
            "statusNotifications",
          label:
            "Status Updates",
        },
        {
          key:
            "browserPopups",
          label:
            "Browser Popups",
        },
        {
          key:
            "notificationSound",
          label:
            "Notification Sounds",
        },
      ].map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between rounded-xl border border-[rgb(var(--border))] p-4"
        >
          <span className="text-sm font-medium">
            {item.label}
          </span>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              saveSettings({
                ...notificationSettings,
                [item.key]:
                  !notificationSettings[
                    item.key
                  ],
              })
            }
            className={[
              "relative h-6 w-11 rounded-full transition",
              notificationSettings[
                item.key
              ]
                ? "bg-[rgb(var(--primary))]"
                : "bg-[rgb(var(--surface-muted))]",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
                notificationSettings[
                  item.key
                ]
                  ? "left-5"
                  : "left-0.5",
              ].join(" ")}
            />
          </button>
        </div>
      ))}

      <div className="rounded-xl border border-[rgb(var(--border))] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock3 size={16} />

          <span className="text-sm font-medium">
            Auto Delete Notifications
          </span>
        </div>

        <select
          value={
            notificationSettings.notificationRetentionDays
          }
          onChange={(e) =>
            saveSettings({
              ...notificationSettings,
              notificationRetentionDays:
                Number(
                  e.target.value
                ),
            })
          }
          className="
            w-full
            rounded-xl
            border
            border-[rgb(var(--border))]
            bg-transparent
            px-4
            py-3
            text-sm
          "
        >
          <option value={7}>
            7 Days
          </option>

          <option value={30}>
            30 Days
          </option>

          <option value={90}>
            90 Days
          </option>

          <option value={180}>
            180 Days
          </option>

          <option value={365}>
            365 Days
          </option>
        </select>
      </div>
    </div>
  </Card>
</Reveal>
        <Reveal delay={0.05}>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
                <UserRound size={18} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Account information
                </h2>

                <p className="text-xs text-[rgb(var(--muted))]">
                  Your current ProjectFlow account details
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-[rgb(var(--border))]">
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
                    Your account is ready to use across your projects
                    and tasks.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
<Reveal delay={0.15}>
  <Card className="mt-5 p-6">
    <div className="mb-5">
      <h2 className="font-semibold">
        Appearance
      </h2>

      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Customize how ProjectFlow looks.
      </p>
    </div>

<div
  className="
    flex
    rounded-2xl
    border
    border-[rgb(var(--border))]
    bg-[rgb(var(--surface-muted)/0.4)]
    p-1
  "
>
  {[
    {
      value: "light",
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
    },
  ].map(({ value, label, icon: Icon }) => (
    <button
      key={value}
      type="button"
      onClick={() => setTheme(value)}
      className="
        relative
        flex-1
        overflow-hidden
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
      "
    >
      {theme === value && (
        <motion.div
          layoutId="theme-pill"
          className="
            absolute
            inset-0
            rounded-xl
            bg-[rgb(var(--primary))]
            shadow-lg
          "
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 35,
          }}
        />
      )}

      <span
        className={[
          "relative z-10 flex items-center justify-center gap-2",
          theme === value
            ? "text-[rgb(var(--primary-foreground))]"
            : "text-[rgb(var(--muted))]",
        ].join(" ")}
      >
        <Icon size={16} />
        {label}
      </span>
    </button>
  ))}
</div>
  </Card>
</Reveal>
      <Reveal delay={0.1}>
        <Card className="mt-5 p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/.10)] text-[rgb(var(--primary))]">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <h2 className="font-semibold">
                Profile ready
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
                Your identity is connected to ProjectFlow. You can
                create projects, manage tasks, assign work, and track
                progress from your workspace.
              </p>
            </div>
          </div>
        </Card>
      </Reveal>
    </PageContainer>
  );
}