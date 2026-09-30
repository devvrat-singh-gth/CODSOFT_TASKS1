"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import * as authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);

    try {
      const { user, token } = await authService.login(
        values.email,
        values.password
      );

      setSession(user, token);

      toast.success(`Welcome back, ${user.name}`);

      router.push(user.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to log in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4.25rem)]">
      <Container className="flex min-h-[calc(100vh-4.25rem)] items-center justify-center py-10 sm:py-14 xl:py-20">
       <div className="glass-strong grid w-full max-w-6xl overflow-hidden rounded-[clamp(1.5rem,2vw,2.25rem)] lg:grid-cols-2">
          {/* Visual side */}
         <div className="ambient-glow relative hidden min-h-[clamp(560px,45vw,720px)] overflow-hidden bg-muted/40 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_80%_80%,hsl(var(--primary)/0.12),transparent_35%)]" />

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
                  Your shopping space
                </p>

                <h2 className="mt-4 max-w-lg text-[clamp(2rem,3vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em]">
                  Pick up where you left off.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-foreground/55">
                  Access your wishlist, cart, orders and personalized shopping
                  experience from one account.
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm text-foreground/55">
                  <ShieldCheck className="h-5 w-5" />
                  Secure account access
                </div>
              </div>

              <div className="text-xs text-foreground/35">
                AuraBazaar · Modern commerce
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Welcome back
                </p>

                <h1 className="mt-2 text-[clamp(1.75rem,2.5vw,2.75rem)] font-semibold tracking-tight">
                  Log in to your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-foreground/55">
                  Continue shopping and manage your AuraBazaar account.
                </p>
              </div>

              <AuthForm
                fields={[
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
                    placeholder: "Enter your password",
                    autoComplete: "current-password",
                  },
                ]}
                submitLabel="Log in"
                onSubmit={handleSubmit}
                loading={loading}
              />

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm text-foreground/55">
                  Don't have an account?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/60"
                >
                  Create an account
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}