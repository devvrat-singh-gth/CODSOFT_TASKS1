"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getDashboardStats,
  getProjects,
  getTasks,
} from "@/services/api";

import type {
  DashboardStats,
} from "@/types/dashboard";

import type {
  Project,
} from "@/types/project";

import type {
  Task,
} from "@/types/task";

import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProjectOverview from "@/components/dashboard/ProjectOverview";
import RecentProjects from "@/components/dashboard/RecentProjects";
import RecentTasks from "@/components/dashboard/RecentTasks";
import ProductivityCard from "@/components/dashboard/ProductivityCard";
import TaskProgress from "@/components/dashboard/TaskProgress";
import EmptyDashboard from "@/components/dashboard/EmptyDashboard";

import Skeleton from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  const [
    tasks,
    setTasks,
  ] = useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          dashboard,
          projectResult,
          taskResult,
        ] = await Promise.all([
          getDashboardStats(),
          getProjects(1, 5),
          getTasks(1, 5),
        ]);

        setStats(dashboard);
        setProjects(
          projectResult.data
        );
        setTasks(
          taskResult.data
        );
      } catch (error: any) {
        setError(
          error?.response?.data
            ?.message ||
            "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const hasData = Boolean(
    stats &&
      (stats.projects > 0 ||
        stats.tasks > 0)
  );

  const completionRate =
    stats &&
    stats.tasks > 0
      ? Math.round(
          (stats.completed /
            stats.tasks) *
            100
        )
      : 0;

  const projectProgress =
    useMemo(() => {
      return projects.map(
        (project) => {
          const projectTasks =
            project.tasks || [];

          const done =
            projectTasks.filter(
              (task) =>
                task.status ===
                "DONE"
            ).length;

          const total =
            projectTasks.length;

          return {
            ...project,
            done,
            total,
            percentage:
              total > 0
                ? Math.round(
                    (done / total) *
                      100
                  )
                : 0,
          };
        }
      );
    }, [projects]);

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <Skeleton className="h-28 rounded-3xl" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-32 rounded-2xl"
              />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Skeleton className="h-72 rounded-3xl" />
            <Skeleton className="h-72 rounded-3xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-3xl border border-[rgb(var(--danger)/0.2)] bg-[rgb(var(--danger)/0.06)] p-6">
          <h1 className="font-semibold">
            Dashboard unavailable
          </h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            {error}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!hasData) {
    return (
      <PageContainer>
        <DashboardHeader />
        <EmptyDashboard />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
     <div className="space-y-8 xl:space-y-10">
        <Reveal>
          <DashboardHeader />
        </Reveal>

        <Reveal delay={0.04}>
          <StatsGrid
            stats={stats!}
          />
        </Reveal>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.7fr]">
          <Reveal delay={0.08}>
            <RecentProjects
  projects={projects}
/>
          </Reveal>

          <Reveal delay={0.12}>
            <ProductivityCard
              completionRate={
                completionRate
              }
              overdue={
                stats?.overdue || 0
              }
              pending={
                stats?.pending || 0
              }
            />
          </Reveal>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Reveal delay={0.16}>
            <TaskProgress
  data={stats!}
/>
          </Reveal>

          <Reveal delay={0.2}>
            <RecentTasks
              tasks={tasks}
            />
          </Reveal>
        </div>
      </div>
    </PageContainer>
  );
}