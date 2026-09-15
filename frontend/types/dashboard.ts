import type {
  Project,
} from "./project";

import type {
  Task,
} from "./task";

export interface DashboardTaskStatus {
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

export interface DashboardStats {
  projects: number;
  tasks: number;
  completed: number;
  pending: number;
  overdue: number;
  taskStatus: DashboardTaskStatus;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProjects: Project[];
  recentTasks: Task[];
}