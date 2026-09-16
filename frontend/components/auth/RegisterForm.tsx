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
  registerUser,
} from "@/services/api";

import {
  useAuth,
} from "@/hooks/useAuth";

import GoogleButton from "./GoogleButton";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const registerSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          1,
          "Name is required"
        )
        .max(
          100,
          "Name must be 100 characters or fewer"
        ),

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
        )
        .max(
          100,
          "Password must be 100 characters or fewer"
        ),

      confirmPassword:
        z.string(),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",
        path: [
          "confirmPassword",
        ],
      }
    );

type RegisterFormData =
  z.infer<typeof registerSchema>;

export default function RegisterForm() {
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

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<RegisterFormData>({
      resolver:
        zodResolver(
          registerSchema
        ),

      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

  const onSubmit =
    async (
      data: RegisterFormData
    ) => {
      setServerError("");

      try {
        const response =
          await registerUser({
            name: data.name,
            email: data.email,
            password:
              data.password,
          });

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
              "Unable to create your account."
          );
        } else {
          setServerError(
            "Unable to create your account. Please try again."
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
        or create with email
      </span>

      <div className="h-px flex-1 bg-[rgb(var(--border))]" />
    </div>

    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-4.5"
    >
      {/* Name */}

      <div className="space-y-2">
        <label
          htmlFor="register-name"
          className="block text-sm font-medium"
        >
          Full name
        </label>

        <Input
          id="register-name"
          {...register("name")}
          autoComplete="name"
          placeholder="What should we call you?"
          aria-invalid={
            Boolean(errors.name)
          }
          className="h-12"
        />

        {errors.name && (
          <p className="text-xs text-[rgb(var(--danger))]">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}

      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className="block text-sm font-medium"
        >
          Email address
        </label>

        <Input
          id="register-email"
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

      {/* Password grid */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="block text-sm font-medium"
          >
            Password
          </label>

                 <div className="relative">
            <Input
              id="register-password"
              {...register("password")}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={
                Boolean(
                  errors.password
                )
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

        <div className="space-y-2">
          <label
            htmlFor="register-confirm-password"
            className="block text-sm font-medium"
          >
            Confirm password
          </label>

                    <div className="relative">
            <Input
              id="register-confirm-password"
              {...register(
                "confirmPassword"
              )}
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Repeat password"
              aria-invalid={
                Boolean(
                  errors.confirmPassword
                )
              }
              className="h-12 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              title={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-[rgb(var(--danger))]">
              {
                errors
                  .confirmPassword
                  .message
              }
            </p>
          )}
        </div>
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
          ? "Creating workspace..."
          : "Create my workspace"}
      </Button>
    </form>

    {/* Account switch */}

    <div className="rounded-2xl border bg-[rgb(var(--surface-muted)/0.38)] px-4 py-4 text-center">
      <p className="text-sm text-[rgb(var(--muted))]">
        Already have an account?
      </p>

      <Link
        href="/login"
        className="mt-1 inline-flex text-sm font-semibold text-[rgb(var(--primary))] transition hover:opacity-80"
      >
        Sign in to your workspace
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