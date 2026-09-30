import { create } from "zustand";
import { User } from "@/types/user";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  hydrate: () => void;
}

// The store is a client-side convenience only — the backend remains the
// authoritative source for who the user is and what role they hold.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  setSession: (user, token) => {
    if (typeof window !== "undefined") localStorage.setItem(AUTH_TOKEN_KEY, token);
    set({ user, token });
  },

  clearSession: () => {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ user: null, token: null });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      set({ token, isHydrated: true });
    }
  },
}));
