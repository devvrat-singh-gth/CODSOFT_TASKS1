"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/hooks/useAuth";

import Spinner from "@/components/ui/Spinner";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const router =
    useRouter();

  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated
    ) {
      router.replace("/login");
    }
  }, [
    loading,
    isAuthenticated,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}