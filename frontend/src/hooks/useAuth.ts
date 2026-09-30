"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/services/authService";

// Loads the current user from the backend whenever a token exists — the
// token in localStorage is a convenience, not proof; /auth/me confirms it.
export function useAuth() {
  const { user, token, isHydrated, setSession, clearSession, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    if (isHydrated && token && !user) {
      getMe()
        .then((me) => setSession(me, token))
        .catch(() => clearSession());
    }
  }, [isHydrated, token, user, setSession, clearSession]);

  return { user, isAuthenticated: !!user, isAdmin: user?.role === "ADMIN" };
}
