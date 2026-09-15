"use client";

import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function CallToAction() {
  const {
    isAuthenticated,
  } = useAuth();

  return (
    <section className="py-24 sm:py-32">
      <div className="container-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border bg-[rgb(var(--surface))] px-6 py-16 text-center sm:px-10">
            <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgb(var(--primary)/0.14)] blur-3xl" />

            <p className="text-sm font-medium text-[rgb(var(--primary))]">
              Ready when you are
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Bring your projects into one clear workspace.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 opacity-60 sm:text-base">
              Plan the work, manage the details,
              and keep moving.
            </p>

            <Link
              href={
                isAuthenticated
                  ? "/dashboard"
                  : "/register"
              }
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-5 py-3.5 text-sm font-medium text-[rgb(var(--primary-foreground))] transition hover:brightness-110"
            >
              {isAuthenticated
                ? "Open dashboard"
                : "Create your account"}

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}