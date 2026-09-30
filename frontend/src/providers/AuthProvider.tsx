"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

// Kicks off session hydration/verification once near the root so every page
// below it can just read from useAuthStore without re-triggering the fetch.
export function AuthProvider({ children }: { children: ReactNode }) {
  useAuth();
  return <>{children}</>;
}
