import api from "../lib/axios";

import type {
  AuthResponse,
  User,
} from "../types/auth";

import type {
  ApiResponse,
  Pagination,
} from "../types/api";

import type {
  Project,
  ProjectInput,
  ProjectUpdateInput,
} from "../types/project";

import type {
  Task,
  TaskInput,
  TaskUpdateInput,
  TaskFilters,
  TaskAssignee,
} from "../types/task";

import type {
  DashboardStats,
} from "../types/dashboard";

import type {
  Notification,
} from "../types/notification";

/* ---------------------------------- */
/* Auth                                */
/* ---------------------------------- */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response =
    await api.post<AuthResponse>(
      "/auth/register",
      payload
    );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      payload
    );

  return response.data;
};

export const getCurrentUser =
  async (): Promise<{
    success: boolean;
    user: User;
  }> => {
    const response =
      await api.get<{
        success: boolean;
        user: User;
      }>("/auth/me");

    return response.data;
  };

/* ---------------------------------- */
/* Dashboard                           */
/* ---------------------------------- */

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response =
      await api.get<
        ApiResponse<DashboardStats>
      >("/dashboard");

    return response.data.data;
  };

/* ---------------------------------- */
/* Projects                            */
/* ---------------------------------- */

export const getProjects = async (
  page = 1,
  limit = 12
) => {
  const response =
    await api.get<{
      success: boolean;
      data: Project[];
      pagination: Pagination;
    }>("/projects", {
      params: {
        page,
        limit,
      },
    });

  return response.data;
};

export const getProject = async (
  projectId: string
): Promise<Project> => {
  const response =
    await api.get<ApiResponse<Project>>(
      `/projects/${projectId}`
    );

  return response.data.data;
};

export const createProject = async (
  payload: ProjectInput
): Promise<Project> => {
  const response =
    await api.post<ApiResponse<Project>>(
      "/projects",
      payload
    );

  return response.data.data;
};

export const updateProject = async (
  projectId: string,
  payload: ProjectUpdateInput
) => {
  const response =
    await api.put<{
      success: boolean;
      message: string;
    }>(
      `/projects/${projectId}`,
      payload
    );

  return response.data;
};

export const deleteProject = async (
  projectId: string
) => {
  const response =
    await api.delete<{
      success: boolean;
      message: string;
    }>(
      `/projects/${projectId}`
    );

  return response.data;
};

/* ---------------------------------- */
/* Tasks                               */
/* ---------------------------------- */

export const getTasks = async (
  page = 1,
  limit = 12,
  filters: TaskFilters = {}
) => {
  const response =
    await api.get<{
      success: boolean;
      data: Task[];
      pagination: Pagination;
    }>("/tasks", {
      params: {
        page,
        limit,
        ...(filters.search
          ? {
              search: filters.search,
            }
          : {}),
        ...(filters.status
          ? {
              status: filters.status,
            }
          : {}),
        ...(filters.priority
          ? {
              priority:
                filters.priority,
            }
          : {}),
      },
    });

  return response.data;
};

export const getTask = async (
  taskId: string
): Promise<Task> => {
  const response =
    await api.get<ApiResponse<Task>>(
      `/tasks/${taskId}`
    );

  return response.data.data;
};

export const createTask = async (
  payload: TaskInput
): Promise<Task> => {
  const response =
    await api.post<ApiResponse<Task>>(
      "/tasks",
      payload
    );

  return response.data.data;
};

export const updateTask = async (
  taskId: string,
  payload: TaskUpdateInput
) => {
  const response =
    await api.put<{
      success: boolean;
      message: string;
    }>(
      `/tasks/${taskId}`,
      payload
    );

  return response.data;
};

export const deleteTask = async (
  taskId: string
) => {
  const response =
    await api.delete<{
      success: boolean;
      message: string;
    }>(
      `/tasks/${taskId}`
    );

  return response.data;
};

/* ---------------------------------- */
/* Users / assignees                   */
/* ---------------------------------- */

export const getAssignableUsers =
  async (): Promise<TaskAssignee[]> => {
    const response =
      await api.get<
        ApiResponse<TaskAssignee[]>
      >("/users");

    return response.data.data;
  };

/* ---------------------------------- */
/* Notifications                       */
/* ---------------------------------- */

export const getNotifications = async (
  page = 1,
  limit = 12,
  unread = false
) => {
  const response =
    await api.get<{
      success: boolean;
      data: Notification[];
      pagination: Pagination;
    }>("/notifications", {
      params: {
        page,
        limit,
        ...(unread
          ? { unread: "true" }
          : {}),
      },
    });

  return response.data;
};

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const response =
      await api.get<
        ApiResponse<{ count: number }>
      >("/notifications/unread-count");

    return response.data.data.count;
  };

export const markNotificationRead =
  async (
    notificationId: string
  ) => {
    const response =
      await api.patch<{
        success: boolean;
        message: string;
      }>(
        `/notifications/${notificationId}/read`
      );

    return response.data;
  };

export const markAllNotificationsRead =
  async () => {
    const response =
      await api.patch<{
        success: boolean;
        message: string;
      }>(
        "/notifications/read-all"
      );

    return response.data;
  };

export const deleteNotification =
  async (
    notificationId: string
  ) => {
    const response =
      await api.delete<{
        success: boolean;
        message: string;
      }>(
        `/notifications/${notificationId}`
      );

    return response.data;
  };

export interface NotificationSettingsPayload {
  dueSoonNotifications: boolean;
  overdueNotifications: boolean;
  assignmentNotifications: boolean;
  statusNotifications: boolean;
  browserPopups: boolean;
  notificationSound: boolean;
  notificationRetentionDays: number;
}

export const getNotificationSettings =
  async () => {
    const response =
      await api.get(
        "/users/notification-settings"
      );

    return response.data;
  };

export const updateNotificationSettings =
  async (
    payload: NotificationSettingsPayload
  ) => {
    const response =
      await api.put(
        "/users/notification-settings",
        payload
      );

    return response.data;
  };