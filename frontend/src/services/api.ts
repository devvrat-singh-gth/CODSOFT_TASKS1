import axios from "axios";
import { API_URL, AUTH_TOKEN_KEY } from "@/lib/constants";

// The single configured Axios client. Every other service file imports this
// instead of calling axios directly, so base URL / auth / error shape stay
// in one place.
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
