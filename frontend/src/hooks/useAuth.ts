"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/services/authService";

/*
 * Prevent multiple components from requesting /auth/me
 * at the same time for the same token.
 */
let authRequest: Promise<unknown> | null = null;
let authRequestToken: string | null = null;

export function useAuth() {
  const {
    user,
    token,
    isHydrated,
    setSession,
    clearSession,
    hydrate,
  } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [isHydrated, hydrate]);

  useEffect(() => {
    if (!isHydrated || !token || user) {
      return;
    }

    /*
     * Another component may already be verifying this token.
     * Reuse that request instead of sending another /auth/me call.
     */
    if (authRequest && authRequestToken === token) {
      return;
    }

    authRequestToken = token;

    authRequest = getMe()
      .then((me) => {
        setSession(me, token);
      })
      .catch((error: Error & { status?: number }) => {
        /*
         * Only clear the session when the backend explicitly
         * says the token is unauthorized.
         *
         * 429 = rate limited
         * 500 = server error
         * network error = backend unavailable
         *
         * None of these mean the user's session is invalid.
         */
        if (error.status === 401) {
          clearSession();
        }
      })
      .finally(() => {
        authRequest = null;
        authRequestToken = null;
      });
  }, [
    isHydrated,
    token,
    user,
    setSession,
    clearSession,
  ]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };
}