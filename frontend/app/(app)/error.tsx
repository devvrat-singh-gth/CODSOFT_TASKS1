"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm opacity-70">
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-xl border px-5 py-2.5"
        >
          Try again
        </button>
      </div>
    </div>
  );
}