import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListTodo,
} from "lucide-react";

import StatCard from "./StatCard";

import type {
  DashboardStats,
} from "@/types/dashboard";

export default function StatsGrid({
  stats,
}: {
  stats: DashboardStats;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      <StatCard
        title="Projects"
        value={stats.projects}
        hint="Across your workspace"
        icon={FolderKanban}
      />

      <StatCard
        title="Total tasks"
        value={stats.tasks}
        hint="Across all projects"
        icon={ListTodo}
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        hint="Tasks finished"
        icon={CheckCircle2}
      />

      <StatCard
        title="Overdue"
        value={stats.overdue}
        hint="Need your attention"
        icon={AlertTriangle}
        tone="warning"
      />
    </div>
  );
}