"use client";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function Hero() {
  const {
    isAuthenticated,
  } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgb(var(--primary)/0.12)] blur-3xl" />
      </div>

      <div className="container-shell grid min-h-[calc(100vh-4rem)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-[rgb(var(--surface)/0.75)] px-3.5 py-2 text-xs font-medium backdrop-blur"
          >
            <Sparkles
              size={14}
              className="text-[rgb(var(--primary))]"
            />

            Simple project management
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.08,
            }}
            className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
          >
            Turn scattered work into{" "}
            <span className="gradient-text">
              clear progress.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.15,
            }}
            className="mt-6 max-w-2xl text-base leading-7 opacity-70 sm:text-lg"
          >
            Organize projects, assign tasks,
            manage deadlines, and see what
            needs attention without the
            clutter of an overcomplicated
            workspace.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.22,
            }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href={
                isAuthenticated
                  ? "/dashboard"
                  : "/register"
              }
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-5 py-3.5 text-sm font-medium text-[rgb(var(--primary-foreground))] transition hover:brightness-110"
            >
              {isAuthenticated
                ? "Open workspace"
                : "Get started free"}

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border bg-[rgb(var(--surface)/0.7)] px-5 py-3.5 text-sm font-medium transition hover:bg-[rgb(var(--surface-muted))]"
            >
              Explore features
            </a>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.35,
            }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm opacity-65"
          >
            {[
              "Projects",
              "Task tracking",
              "Deadlines",
              "Progress overview",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2"
              >
                <Check
                  size={14}
                  className="text-[rgb(var(--success))]"
                />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 24,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.12,
          }}
          className="relative"
        >
          <div className="glass-surface rounded-3xl p-4 shadow-2xl">
            <div className="rounded-2xl border bg-[rgb(var(--background))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-50">
                    Workspace
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    This week
                  </h2>
                </div>

                <div className="rounded-xl bg-[rgb(var(--primary)/0.12)] px-3 py-2 text-xs font-medium text-[rgb(var(--primary))]">
                  On track
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  [
                    "Projects",
                    "12",
                  ],
                  [
                    "Active tasks",
                    "34",
                  ],
                  [
                    "Completed",
                    "78%",
                  ],
                  [
                    "Overdue",
                    "3",
                  ],
                ].map(
                  ([
                    label,
                    value,
                  ]) => (
                    <div
                      key={label}
                      className="rounded-2xl border bg-[rgb(var(--surface))] p-4"
                    >
                      <p className="text-xs opacity-55">
                        {label}
                      </p>

                      <p className="mt-2 text-2xl font-semibold">
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 rounded-2xl border bg-[rgb(var(--surface))] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    Product launch
                  </span>

                  <span className="opacity-60">
                    72%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgb(var(--surface-muted))]">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: "72%",
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.7,
                    }}
                    className="h-full rounded-full bg-[rgb(var(--primary))]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}