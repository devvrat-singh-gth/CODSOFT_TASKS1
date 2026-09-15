export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE";

export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface TaskAssignee {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface TaskProjectRef {
  id: string;
  title: string;
  status?:
    | "PLANNING"
    | "IN_PROGRESS"
    | "COMPLETED";
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string | null;
  projectId: string;
  project?: TaskProjectRef | null;
  assignedToId?: string | null;
  assignedTo?: TaskAssignee | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string | null;
  projectId: string;
  assignedToId?: string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string | null;
  assignedToId?: string | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | "ALL";
  priority?: Priority | "ALL";
  page?: number;
  limit?: number;
}