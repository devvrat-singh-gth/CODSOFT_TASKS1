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
<div className="h-screen overflow-hidden bg-[rgb(var(--background))]">
  <div className="flex h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
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