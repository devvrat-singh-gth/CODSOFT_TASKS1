import api from "./api";
import { User } from "@/types/user";

interface AuthResponse {
  user: User;
  token: string;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<{ data: AuthResponse }>("/auth/register", {
    name,
    email,
    password,
  });
  return data.data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ data: AuthResponse }>("/auth/login", { email, password });
  return data.data;
}

export async function getMe() {
  const { data } = await api.get<{ data: User }>("/auth/me");
  return data.data;
}
