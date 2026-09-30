"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) return; // still resolving
    if (!user) router.replace("/login");
    else if (adminOnly && !isAdmin) router.replace("/");
  }, [user, isAdmin, adminOnly, router]);

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
