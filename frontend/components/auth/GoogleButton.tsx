"use client";

import Button from "@/components/ui/Button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function GoogleButton() {
  const handleGoogleLogin =
    () => {
      window.location.assign(
        `${API_URL}/oauth/google`
      );
    };

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={handleGoogleLogin}
      className="w-full"
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-items-center rounded-full border bg-[rgb(var(--surface-muted))] text-xs font-bold"
      >
        G
      </span>

      Continue with Google
    </Button>
  );
}