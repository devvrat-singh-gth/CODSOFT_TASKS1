"use client";

import {
  useState,
} from "react";

import {
  Toaster,
} from "sonner";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Topbar
            onMenu={() =>
              setMobileOpen(true)
            }
          />

          {children}
        </div>
      </div>

      <MobileSidebar
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <Toaster
        position="bottom-right"
        richColors
        theme="system"
        closeButton
      />
    </div>
  );
}