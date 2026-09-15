"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getToken,
  removeToken,
  setToken,
} from "@/lib/auth";

import {
  getCurrentUser,
} from "@/services/api";

import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuthenticatedSession: (
    token: string,
    user: User
  ) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
      const token = getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response =
          await getCurrentUser();

        setUser(
          response.user
        );
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);

  const setAuthenticatedSession =
    useCallback(
      (
        token: string,
        authenticatedUser: User
      ) => {
        setToken(token);
        setUser(
          authenticatedUser
        );
      },
      []
    );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleForcedLogout =
      () => {
        removeToken();
        setUser(null);
      };

    window.addEventListener(
      "auth:logout",
      handleForcedLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleForcedLogout
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        Boolean(user),
      setAuthenticatedSession,
      refreshUser,
      logout,
    }),
    [
      user,
      loading,
      setAuthenticatedSession,
      refreshUser,
      logout,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}