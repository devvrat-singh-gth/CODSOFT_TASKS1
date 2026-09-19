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
    "sticky top-0 z-[60] flex h-screen w-64 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))]",
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
<>
 <img
  src="/workorbit-logo.svg"
  alt=""
  className="h-12 w-12 shrink-0 drop-shadow-[0_0_12px_rgb(var(--primary)/0.45)]"
/>
  <span className="bg-gradient-to-r from-[rgb(var(--foreground))] via-[rgb(var(--primary))] to-[rgb(var(--accent))] bg-clip-text text-base font-bold text-transparent">
    WorkOrbit
  </span>
</>
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
          <>
          <img
            src="/workorbit-logo.svg"
            alt=""
            className="h-12 w-12 shrink-0 drop-shadow-[0_0_12px_rgb(var(--primary)/0.45)]"
          />
            <span className="bg-gradient-to-r from-[rgb(var(--foreground))] via-[rgb(var(--primary))] to-[rgb(var(--accent))] bg-clip-text text-base font-bold text-transparent">
              WorkOrbit
            </span>
          </>
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
  ? [
      "bg-[rgb(var(--primary)/0.1)]",
      "font-semibold",
      "text-[rgb(var(--primary))]",
      "shadow-[0_0_20px_rgb(var(--primary)/0.14)]",
      "ring-1 ring-[rgb(var(--primary)/0.2)]",
    ].join(" ")
  : [
      "text-[rgb(var(--muted))]",
      "hover:bg-[rgb(var(--surface-muted))]",
      "hover:text-[rgb(var(--foreground))]",
      "hover:shadow-[0_0_14px_rgb(var(--primary)/0.08)]",
    ].join(" ")
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
className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-[rgb(var(--surface-muted)/0.55)] px-3 py-3 text-left transition-all duration-200 hover:border-[rgb(var(--primary)/0.2)] hover:bg-[rgb(var(--surface-muted))] hover:shadow-[0_0_18px_rgb(var(--primary)/0.10)]"  >
<span className="rounded-full p-[2px] bg-gradient-to-br from-sky-400 via-[rgb(var(--primary))] to-violet-500 shadow-[0_0_14px_rgb(var(--primary)/0.42)]">
  <Avatar
    src={user?.avatarUrl}
    name={user?.name}
    size="md"
    className="ring-0"
  />
</span>

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
z-[100]
w-52
overflow-hidden
rounded-xl
border
border-[rgb(var(--border))]
bg-[rgb(var(--surface))]
shadow-[0_12px_40px_rgb(0_0_0/0.22)]
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