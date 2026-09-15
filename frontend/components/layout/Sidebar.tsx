"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  X,ChevronRight, LogOut
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/ui/Avatar";
const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: ListTodo,
  },
];

export default function Sidebar({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
const pathname = usePathname();
const router = useRouter();

const { user, logout } = useAuth();
const [profileOpen, setProfileOpen] =
  useState(false);
  const EXIT_DURATION = 180;

const profileRef =
  useRef<HTMLDivElement>(null);
const handleProfileClick = () => {
  setProfileOpen(false);

  setTimeout(() => {
    if (mobile) {
      onClose?.();
    }

    router.push("/profile");
  }, EXIT_DURATION);
};

const handleLogoutClick = () => {
  setProfileOpen(false);

  setTimeout(() => {
    logout();
  }, EXIT_DURATION);
};

useEffect(() => {
  function handleClickOutside(
    event: MouseEvent
  ) {
    if (
      profileRef.current &&
      !profileRef.current.contains(
        event.target as Node
      )
    ) {
      setProfileOpen(false);
    }
  }

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
  return (
    <aside
 className={cn(
  "sticky top-0 flex h-screen w-64 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))]",
  mobile ? "w-full" : "hidden lg:flex"
)}
    >
      {mobile && (
        <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
            onClick={onClose}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgb(var(--primary))] text-sm font-bold text-[rgb(var(--primary-foreground))]">
              P
            </span>

            ProjectFlow
          </Link>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[rgb(var(--surface-muted))]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="px-4 py-5">
        {!mobile && (
          <Link
            href="/dashboard"
            className="mb-7 flex items-center gap-2 px-2 font-semibold"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgb(var(--primary))] text-sm font-bold text-[rgb(var(--primary-foreground))]">
              P
            </span>

            ProjectFlow
          </Link>
        )}

        <nav className="space-y-1">
          {links.map(
            ({
              href,
              label,
              icon: Icon,
            }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" &&
                  pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={
                    mobile
                      ? onClose
                      : undefined
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                    active
                      ? "bg-[rgb(var(--primary)/0.1)] font-semibold text-[rgb(var(--primary))]"
                      : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            }
          )}
        </nav>
      </div>

      {/* PROFILE CARD */}
<div
  ref={profileRef}
  className="relative mt-auto border-t border-[rgb(var(--border))] p-4"
>
  <button
    type="button"
    onClick={() =>
      setProfileOpen(
        !profileOpen
      )
    }
    className="flex w-full items-center gap-3 rounded-xl bg-[rgb(var(--surface-muted)/0.55)] px-3 py-3 text-left transition hover:bg-[rgb(var(--surface-muted))]"
  >
<Avatar
  src={user?.avatarUrl}
  name={user?.name}
  size="md"
/>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">
        {user?.name ||
          "Workspace member"}
      </p>

      <p className="truncate text-xs text-[rgb(var(--muted))]">
        {user?.email || ""}
      </p>
    </div>

    <ChevronRight
      size={16}
      className={`transition-transform ${
        profileOpen
          ? "rotate-90"
          : ""
      }`}
    />
  </button>

  <AnimatePresence>
    {profileOpen && (
      <motion.div
      initial={{
  opacity: 0,
  x: -20,
}}
animate={{
  opacity: 1,
  x: 0,
}}
exit={{
  opacity: 0,
  x: -20,
}}
transition={{
  duration:
    EXIT_DURATION / 1000,
}}
       className="
absolute
left-[calc(100%+12px)]
bottom-4
w-52
z-50
overflow-hidden
rounded-xl
border
border-[rgb(var(--border))]
bg-[rgb(var(--surface))]
shadow-2xl
"
      >
<button
  type="button"
 onClick={handleProfileClick}
  className="block w-full px-4 py-3 text-left text-sm transition hover:bg-[rgb(var(--surface-muted))]"
>
  Profile
</button>
       <button
  type="button"
onClick={handleLogoutClick}
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[rgb(var(--danger))] transition hover:bg-[rgb(var(--danger)/0.08)]"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>
    </aside>
  );
}