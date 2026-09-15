export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;

  dueSoonNotifications?: boolean;
  overdueNotifications?: boolean;
  assignmentNotifications?: boolean;
  statusNotifications?: boolean;

  browserPopups?: boolean;
  notificationSound?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}