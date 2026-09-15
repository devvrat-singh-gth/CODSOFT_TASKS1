"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  getCurrentUser,
} from "@/services/api";

import {
  setToken, removeToken
} from "@/lib/auth";

export default function OAuthCallbackPage() {
  const router =
    useRouter();

  const {
    setAuthenticatedSession,
  } = useAuth();

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const completeOAuth =
      async () => {
        try {
          const hash =
            window.location.hash;

          const params =
            new URLSearchParams(
              hash.replace(
                /^#/,
                ""
              )
            );

          const token =
            params.get("token");

          if (!token) {
            throw new Error(
              "OAuth token was not provided"
            );
          }

          setToken(token);

          const response =
            await getCurrentUser();

          setAuthenticatedSession(
            token,
            response.user
          );

          window.history.replaceState(
            null,
            "",
            "/oauth/callback"
          );

          router.replace(
            "/dashboard"
          );
        } catch {
  removeToken();

  setError(
    "Google sign-in could not be completed."
  );
}
      };

    completeOAuth();
  }, [
    router,
    setAuthenticatedSession,
  ]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">
            Authentication failed
          </h1>

          <p className="mt-2 text-sm opacity-70">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />

        <p>
          Signing you in...
        </p>
      </div>
    </main>
  );
}