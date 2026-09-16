"use client";

import {
  Menu,
} from "lucide-react";

import Breadcrumbs from "./Breadcrumbs";
import NotificationButton from "../notifications/NotificationButton";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ui/ThemeToggle";

export default function Topbar({
  onMenu,
}: {
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-[rgb(var(--border))] bg-[rgb(var(--background)/0.82)] backdrop-blur-2xl">
     <div className="flex w-full items-center justify-between px-6 gap-4">
       <div className="flex min-w-0 items-center gap-3">
  <button
    type="button"
    onClick={onMenu}
    aria-label="Open navigation"
    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] lg:hidden"
  >
    <Menu size={19} />
  </button>

  <img
    src="/workorbit-logo.svg"
    alt="WorkOrbit"
    className="h-9 w-9 shrink-0 drop-shadow-[0_0_12px_rgb(var(--primary)/0.45)]"
  />

  <div className="min-w-0">
    <Breadcrumbs />
  </div>
</div>
       <div className="ml-auto flex shrink-0 items-center gap-3">
  <ThemeToggle />

  <NotificationButton />

  <div className="lg:hidden">
    <UserMenu />
  </div>
</div>
      </div>
    </header>
  );
}