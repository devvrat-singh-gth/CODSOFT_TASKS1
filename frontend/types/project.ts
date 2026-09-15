export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface ProjectTaskSummary {
  id: string;
  title: string;
  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE";
  dueDate?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  tasks?: ProjectTaskSummary[];
}

export interface ProjectInput {
  title: string;
  description?: string | null;
}

export interface ProjectUpdateInput {
  title?: string;
  description?: string | null;
  status?: ProjectStatus;
}