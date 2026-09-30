"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import * as authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);

    try {
      const { user, token } = await authService.register(
        values.name,
        values.email,
        values.password
      );

      setSession(user, token);

      toast.success("Your account has been created");

      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4.25rem)]">
      <Container className="flex min-h-[calc(100vh-4.25rem)] items-center justify-center py-10 sm:py-14 xl:py-20">
        <div className="glass-strong grid w-full max-w-6xl overflow-hidden rounded-[clamp(1.5rem,2vw,2.25rem)] lg:grid-cols-2">
          {/* Form side */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Join AuraBazaar
                </p>

                <h1 className="mt-2 text-[clamp(1.75rem,2.5vw,2.75rem)] font-semibold tracking-tight">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-foreground/55">
                  Create an account to save products, manage your orders and
                  make checkout easier.
                </p>
              </div>

              <AuthForm
                fields={[
                  {
                    name: "name",
                    label: "Full name",
                    placeholder: "Your name",
                    autoComplete: "name",
                  },
                  {
                    name: "email",
                    label: "Email address",
                    type: "email",
                    placeholder: "you@example.com",
                    autoComplete: "email",
                  },
                  {
                    name: "password",
                    label: "Password",
                    type: "password",
                    placeholder: "Create a password",
                    autoComplete: "new-password",
                  },
                ]}
                submitLabel="Create account"
                onSubmit={handleSubmit}
                loading={loading}
              />

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm text-foreground/55">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/60"
                >
                  Log in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Visual side */}
          <div className="ambient-glow relative hidden min-h-[clamp(560px,45vw,720px)] overflow-hidden bg-muted/40 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_20%_85%,hsl(var(--primary)/0.12),transparent_38%)]" />

            <div className="relative flex h-full flex-col justify-between p-10">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to AuraBazaar
              </Link>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                  One account
                </p>

                <h2 className="mt-4 max-w-lg text-[clamp(2rem,3vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em]">
                  Make shopping feel effortless.
                </h2>

                <div className="mt-8 space-y-4">
                  {[
                    "Save products to your wishlist",
                    "Keep your cart ready for checkout",
                    "Track your orders in one place",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-foreground/60"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background/60">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-foreground/35">
                AuraBazaar · Modern commerce
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}