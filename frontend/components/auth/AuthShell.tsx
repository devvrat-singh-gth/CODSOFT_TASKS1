"use client";

import Link from "next/link";

import {
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import Card from "@/components/ui/Card";
import ThemeToggle from "@/components/ui/ThemeToggle";

type AuthMode =
  | "login"
  | "register";

interface AuthShellProps {
  mode: AuthMode;
  children: React.ReactNode;
}

const content = {
  login: {
    eyebrow: "Welcome back",
    title:
      "Pick up where you left off.",
    description:
      "Your projects, tasks, deadlines, and progress are waiting in one focused workspace.",
    badge:
      "Your workspace is ready",
  },

  register: {
    eyebrow: "Get started",
    title:
      "Build a calmer way to manage your work.",
    description:
      "Create your workspace, organize your projects, and keep every important task within reach.",
    badge:
      "Start organizing today",
  },
};

const benefits = [
  "Projects and tasks in one place",
  "Clear deadlines and progress",
  "Private account-based workspace",
];

export default function AuthShell({
  mode,
  children,
}: AuthShellProps) {
  const copy = content[mode];

  const isLogin =
    mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      {/* Ambient background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[4%] top-[2%] h-72 w-72 rounded-full bg-[rgb(var(--primary)/0.08)] blur-3xl" />

        <div className="absolute bottom-[4%] right-[3%] h-80 w-80 rounded-full bg-[rgb(var(--accent)/0.045)] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--primary)/0.03)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <Card className="w-full overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left visual panel */}

            <motion.section
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className={[
                "relative hidden min-h-[650px] overflow-hidden",
                "border-r p-10",
                "lg:flex lg:flex-col lg:justify-between",
                isLogin
                  ? "bg-[linear-gradient(145deg,rgb(var(--primary)/0.08),transparent_55%)]"
                  : "bg-[linear-gradient(145deg,rgb(var(--accent)/0.055),transparent_55%)]",
              ].join(" ")}
            >
              {/* Decorative grid */}

              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize:
                    "32px 32px",
                }}
              />

              <div className="relative z-10">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[rgb(var(--primary))] text-sm font-bold text-[rgb(var(--primary-foreground))] shadow-lg shadow-[rgb(var(--primary)/0.18)]">
                    P
                  </span>

                  <span className="text-lg font-semibold tracking-tight">
                    WorkOrbit
                  </span>
                </Link>
              </div>

              <div className="relative z-10 max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-[rgb(var(--surface)/0.65)] px-3.5 py-2 text-xs font-medium backdrop-blur-xl">
                  <Sparkles
                    size={13}
                    className="text-[rgb(var(--primary))]"
                  />

                  {copy.badge}
                </div>

                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em]">
                  {copy.title}
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-[rgb(var(--muted))]">
                  {copy.description}
                </p>

                <div className="mt-8 space-y-3.5">
                  {benefits.map(
                    (benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgb(var(--primary)/0.11)] text-[rgb(var(--primary))]">
                          <Check
                            size={14}
                          />
                        </span>

                        <span className="text-[rgb(var(--muted))]">
                          {benefit}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="relative z-10 rounded-2xl border bg-[rgb(var(--surface)/0.62)] p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[rgb(var(--success))]"
                  />

                  <p className="text-xs font-medium">
                    Focused and secure
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    [
                      "Projects",
                      "12",
                    ],
                    [
                      "Tasks",
                      "34",
                    ],
                    [
                      "Progress",
                      "78%",
                    ],
                  ].map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border bg-[rgb(var(--surface)/0.78)] p-3"
                      >
                        <p className="text-[10px] text-[rgb(var(--muted))]">
                          {label}
                        </p>

                        <p className="mt-1.5 text-lg font-semibold">
                          {value}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.section>

            {/* Right form panel */}

            <motion.section
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.04,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="relative flex min-h-[650px] flex-col"
            >
              {/* Top bar */}

              <div className="flex items-center justify-between border-b px-5 py-4 sm:px-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 lg:hidden"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgb(var(--primary))] text-xs font-bold text-[rgb(var(--primary-foreground))]">
                    P
                  </span>

                  <span className="font-semibold">
                    WorkOrbit
                  </span>
                </Link>

                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>

              {/* Form area */}

              <div className="flex flex-1 items-center px-5 py-9 sm:px-10 sm:py-12">
                <div className="mx-auto w-full max-w-lg">
                  <div className="mb-8">
                    <p className="text-sm font-medium text-[rgb(var(--primary))]">
                      {copy.eyebrow}
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-[2.65rem] sm:leading-tight">
                      {isLogin
                        ? "Sign in to your workspace"
                        : "Create your workspace"}
                    </h1>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-[rgb(var(--muted))]">
                      {isLogin
                        ? "Use your account credentials or continue with Google."
                        : "A simple account is all you need to start organizing your projects."}
                    </p>
                  </div>

                  {children}
                </div>
              </div>

              {/* Minimal bottom status */}

              <div className="border-t px-5 py-4 text-center text-xs text-[rgb(var(--muted))] sm:px-8">
                {isLogin
                  ? "Welcome back to your workspace."
                  : "Your personal workspace starts here."}
              </div>
            </motion.section>
          </div>
        </Card>
      </div>
    </main>
  );
}