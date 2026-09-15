export type NotificationType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED"
  | "TASK_STATUS_CHANGED"
  | "TASK_DUE_SOON"
  | "TASK_OVERDUE";
  
export interface NotificationTaskRef {
  id: string;
  title: string;
}

export interface NotificationProjectRef {
  id: string;
  title: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  expiresAt: string;
  userId: string;
  taskId: string | null;
  projectId: string | null;
  task?: NotificationTaskRef | null;
  project?: NotificationProjectRef | null;
}