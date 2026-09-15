"use client";

import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function DashboardHeader() {
  const {
    user,
  } = useAuth();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "there";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgb(var(--primary)/0.12),rgb(var(--surface))_48%,rgb(var(--accent)/0.07))] p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[rgb(var(--primary)/0.08)] blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface)/0.8)] px-3 py-1.5 text-xs font-medium text-[rgb(var(--muted))]">
            <Sparkles
              size={13}
              className="text-[rgb(var(--primary))]"
            />
            Workspace overview
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Good to see you,{" "}
            <span className="gradient-text">
              {firstName}.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))] sm:text-base">
            Keep momentum across your
            projects, tasks, and
            deadlines without losing
            the bigger picture.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-medium text-[rgb(var(--primary-foreground))] transition hover:brightness-110"
        >
          View projects
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}