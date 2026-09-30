"use client";

import Image from "next/image";
import {
  CheckCircle2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

function getInitials(name?: string, email?: string) {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const parts = trimmedName.split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  return email?.charAt(0).toUpperCase() || "U";
}

function ProfileForm() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  const initials = getInitials(user?.name, user?.email);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      await api.put("/users/profile", {
        name: name.trim(),
        phone: phone.trim(),
      });

      toast.success("Profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <Container className="py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/40">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55 sm:text-base">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          {/* Profile summary */}
          <section className="rounded-3xl border border-border bg-background/60 p-6 sm:p-7">
            <div className="flex flex-col items-center text-center">
              {user?.avatar?.url ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-8 ring-primary/10">
                  <Image
                    src={user.avatar.url}
                    alt={`${user.name || "User"} profile picture`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground shadow-glow ring-8 ring-primary/10"
                  aria-label={`Profile avatar for ${user?.name || "user"}`}
                >
                  {initials}
                </div>
              )}

              <h2 className="mt-5 text-xl font-semibold">
                {user?.name || "Your account"}
              </h2>

              <p className="mt-1 break-all text-sm text-foreground/50">
                {user?.email}
              </p>
            </div>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/40">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-medium">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/40">
                    Account type
                  </p>

                  <p className="mt-0.5 text-sm font-medium">
                    {user?.role === "ADMIN"
                      ? "Administrator"
                      : "Customer"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/40">
                    Status
                  </p>

                  <p className="mt-0.5 text-sm font-medium">
                    Active account
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="mt-7 w-full border-red-500/30 text-red-600 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </section>

          {/* Edit profile */}
          <section className="rounded-3xl border border-border bg-background/60 p-6 sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/40">
                Personal information
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Profile details
              </h2>

              <p className="mt-1 text-sm text-foreground/50">
                Keep your contact information up to date.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Name
                </label>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />

                  <Input
                    value={user?.email || ""}
                    disabled
                    className="pl-10"
                  />
                </div>

                <p className="mt-1.5 text-xs text-foreground/40">
                  Your account email cannot be changed here.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Phone
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />

                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}