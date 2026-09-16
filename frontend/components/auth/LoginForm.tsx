"use client";

import {
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

import axios from "axios";

import {
  loginUser,
} from "@/services/api";

import {
  useAuth,
} from "@/hooks/useAuth";

import GoogleButton from "./GoogleButton";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const loginSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email address"
      ),

    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      ),
  });

type LoginFormData =
  z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router =
    useRouter();

  const {
    setAuthenticatedSession,
  } = useAuth();

  const [
    serverError,
    setServerError,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<LoginFormData>({
      resolver:
        zodResolver(
          loginSchema
        ),

      defaultValues: {
        email: "",
        password: "",
      },
    });

  const onSubmit =
    async (
      data: LoginFormData
    ) => {
      setServerError("");

      try {
        const response =
          await loginUser(data);

        setAuthenticatedSession(
          response.token,
          response.user
        );

        router.replace(
          "/dashboard"
        );
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          setServerError(
            error.response?.data
              ?.message ||
              "Unable to sign in. Please check your details."
          );
        } else {
          setServerError(
            "Unable to sign in. Please try again."
          );
        }
      }
    };
return (
  <div className="space-y-7">
    {/* Google */}

    <GoogleButton />

    {/* Divider */}

    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-[rgb(var(--border))]" />

      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
        or continue with email
      </span>

      <div className="h-px flex-1 bg-[rgb(var(--border))]" />
    </div>

    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-5"
    >
      {/* Email */}

      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium"
        >
          Email address
        </label>

        <Input
          id="login-email"
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={
            Boolean(errors.email)
          }
          className="h-12"
        />

        {errors.email && (
          <p className="text-xs text-[rgb(var(--danger))]">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="text-sm font-medium"
          >
            Password
          </label>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            {...register("password")}
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={
              Boolean(errors.password)
            }
            className="h-12 pr-12"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (value) => !value
              )
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            title={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-[rgb(var(--danger))]">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Server error */}

      {serverError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          role="alert"
          className="rounded-xl border border-[rgb(var(--danger)/0.25)] bg-[rgb(var(--danger)/0.08)] px-4 py-3 text-sm text-[rgb(var(--danger))]"
        >
          {serverError}
        </motion.div>
      )}

      {/* Submit */}

      <Button
        type="submit"
        loading={isSubmitting}
        size="lg"
        className="h-12 w-full shadow-lg shadow-[rgb(var(--primary)/0.12)]"
      >
        {isSubmitting
          ? "Signing in..."
          : "Sign in to WorkOrbit"}
      </Button>
    </form>

    {/* Account switch */}

    <div className="rounded-2xl border bg-[rgb(var(--surface-muted)/0.38)] px-4 py-4 text-center">
      <p className="text-sm text-[rgb(var(--muted))]">
        Don't have an account?
      </p>

      <Link
        href="/register"
        className="mt-1 inline-flex text-sm font-semibold text-[rgb(var(--primary))] transition hover:opacity-80"
      >
        Create your workspace
        <span
          aria-hidden="true"
          className="ml-1"
        >
          →
        </span>
      </Link>
    </div>
  </div>
);
}