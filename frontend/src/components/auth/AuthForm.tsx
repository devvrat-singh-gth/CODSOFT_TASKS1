"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function AuthForm({
  fields,
  submitLabel,
  onSubmit,
  loading,
}: {
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
  loading?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
   <form onSubmit={handleSubmit} className="space-y-[clamp(1rem,1.3vw,1.4rem)]">
      {fields.map((field) => {
        const isPassword = field.type === "password";
        const inputType =
          isPassword && showPassword ? "text" : field.type || "text";

        return (
          <div key={field.name}>
            <label
              htmlFor={`auth-${field.name}`}
              className="mb-2 block text-[clamp(0.8rem,0.85vw,0.95rem)] font-medium"
            >
              {field.label}
            </label>

            <div className="relative">
              <Input
                id={`auth-${field.name}`}
                type={inputType}
                required
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={values[field.name] || ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }))
                }
                className={isPassword ? "pr-11" : undefined}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <Button
        type="submit"
        className="fluid-button mt-2 w-full"
        disabled={loading}
      >
        {loading ? "Please wait..." : submitLabel}
      </Button>
    </form>
  );
}