"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm opacity-70">
          We couldn't load this page. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl border px-5 py-3 transition hover:opacity-80"
        >
          Try again
        </button>
      </div>
    </main>
  );
}