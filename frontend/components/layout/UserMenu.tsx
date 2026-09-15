"use client";

import Link from "next/link";

import {
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";

export default function UserMenu() {
  const {
    user,
    logout,
  } = useAuth();

  return (
  <Dropdown
  trigger={
    <button
      type="button"
      aria-label="Open account menu"
      className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[rgb(var(--primary)/0.14)]"
    >
      <Avatar
        name={user?.name}
        src={user?.avatarUrl}
        size="sm"
      />

      <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
        {user?.name || "Account"}
      </span>
    </button>
  }
>
  {(close) => (
    <>
      <Link
        href="/profile"
        onClick={(e) => {
          e.preventDefault();

          close();

          setTimeout(() => {
            window.location.href =
              "/profile";
          }, 150);
        }}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition hover:bg-[rgb(var(--surface-muted))]"
      >
        <UserRound size={16} />
        Profile
      </Link>

      <button
        type="button"
        onClick={() => {
          close();

          setTimeout(() => {
            logout();
          }, 150);
        }}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[rgb(var(--danger))] transition hover:bg-[rgb(var(--danger)/0.08)]"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </>
  )}
</Dropdown>
  );
}