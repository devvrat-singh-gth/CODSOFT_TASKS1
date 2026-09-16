"use client";

import Link from "next/link";

import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useAuth,
} from "@/hooks/useAuth";

import ThemeToggle from "@/components/ui/ThemeToggle";

const sectionLinks = [
  {
    label: "Features",
    id: "features",
  },
  {
    label: "How it works",
    id: "how-it-works",
  },
  {
    label: "Benefits",
    id: "benefits",
  },
];

const NAV_HEIGHT = 64;
const INACTIVITY_DELAY = 500;

export default function Navbar() {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    navVisible,
    setNavVisible,
  ] = useState(true);

  const lastScrollYRef =
    useRef(0);

  const inactivityTimerRef =
    useRef<number | null>(null);

  const mobileOpenRef =
    useRef(false);

  useEffect(() => {
    mobileOpenRef.current =
      mobileOpen;
  }, [mobileOpen]);

  /*
   * Scroll to a landing-page section
   */
  const scrollToSection = (
    id: string
  ) => {
    const element =
      document.getElementById(id);

    setMobileOpen(false);

    if (!element) {
      return;
    }

    document.body.style.overflow = "";

    window.setTimeout(() => {
      const elementTop =
        element.getBoundingClientRect()
          .top + window.scrollY;

      const targetPosition =
        elementTop - NAV_HEIGHT;

      window.scrollTo({
        top: Math.max(
          targetPosition,
          0
        ),
        behavior: "smooth",
      });
    }, 120);
  };

  /*
   * Mobile body scroll lock
   */
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileOpen]);

  /*
   * Close mobile navigation when
   * switching to desktop width.
   */
  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth >= 768 &&
        mobileOpenRef.current
      ) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * Smart navbar behavior
   *
   * Scroll down  -> hide
   * Scroll up    -> show
   * Stop activity for 2s -> show
   * At top       -> always show
   */
  useEffect(() => {
    lastScrollYRef.current =
      window.scrollY;

    const clearInactivityTimer =
      () => {
        if (
          inactivityTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            inactivityTimerRef.current
          );

          inactivityTimerRef.current =
            null;
        }
      };

    const startInactivityTimer =
      () => {
        clearInactivityTimer();

        inactivityTimerRef.current =
          window.setTimeout(() => {
            setNavVisible(true);

            inactivityTimerRef.current =
              null;
          }, INACTIVITY_DELAY);
      };

    const handleActivity = () => {
      /*
       * Mobile menu must always retain
       * a visible navbar.
       */
      if (mobileOpenRef.current) {
        setNavVisible(true);
        return;
      }

      startInactivityTimer();
    };

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      const previousScrollY =
        lastScrollYRef.current;

      /*
       * Always visible at the very top.
       */
      if (currentScrollY <= 8) {
        setNavVisible(true);

        lastScrollYRef.current =
          currentScrollY;

        startInactivityTimer();

        return;
      }

      /*
       * Mobile menu keeps navbar visible.
       */
      if (mobileOpenRef.current) {
        setNavVisible(true);

        lastScrollYRef.current =
          currentScrollY;

        return;
      }

      /*
       * Scrolling upward:
       * reveal immediately.
       */
      if (
        currentScrollY <
        previousScrollY
      ) {
        setNavVisible(true);
      }

      /*
       * Scrolling downward:
       * hide immediately.
       */
      else if (
        currentScrollY >
        previousScrollY
      ) {
        setNavVisible(false);
      }

      lastScrollYRef.current =
        currentScrollY;

      /*
       * Once scrolling/activity stops,
       * the 2-second timer begins.
       */
      startInactivityTimer();
    };

    const handlePointerDown =
      () => {
        handleActivity();
      };

    const handlePointerMove =
      () => {
        handleActivity();
      };

    const handleKeyDown =
      () => {
        handleActivity();
      };

    const handleTouchStart =
      () => {
        handleActivity();
      };

    /*
     * Start the initial inactivity
     * timer as well.
     */
    startInactivityTimer();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "pointerdown",
      handlePointerDown,
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      { passive: true }
    );

    return () => {
      clearInactivityTimer();

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );
    };
  }, []);

  return (
    <>
      {/* Fixed navbar shell */}
      <motion.header
        initial={false}
        animate={{
          y: navVisible
            ? 0
            : -(NAV_HEIGHT + 4),
        }}
        transition={{
          duration: 0.28,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--background)/0.80)] backdrop-blur-xl"
      >
        <div className="container-shell flex h-16 items-center justify-between">
          {/* Logo */}

<Link
  href="/"
  className="group flex items-center gap-2.5"
  onClick={() =>
    setMobileOpen(false)
  }
>
  <img
    src="/workorbit-logo.svg"
    alt="WorkOrbit"
    className="h-10 w-10 shrink-0 drop-shadow-[0_0_12px_rgb(var(--primary)/0.45)] transition-all duration-200 group-hover:drop-shadow-[0_0_18px_rgb(var(--primary)/0.65)]"
  />

  <span className="bg-gradient-to-r from-[rgb(var(--foreground))] via-[rgb(var(--primary))] to-[rgb(var(--accent))] bg-clip-text text-lg font-bold tracking-tight text-transparent transition-all duration-200 group-hover:drop-shadow-[0_0_10px_rgb(var(--primary)/0.18)]">
    WorkOrbit
  </span>
</Link>

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-7 md:flex">
            {!isAuthenticated ? (
              <>
                {sectionLinks.map(
                  (link) => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() =>
                        scrollToSection(
                          link.id
                        )
                      }
className="rounded-lg px-2.5 py-2 text-sm text-[rgb(var(--muted))] transition-all duration-200 hover:bg-[rgb(var(--primary)/0.06)] hover:text-[rgb(var(--foreground))] hover:shadow-[0_0_16px_rgb(var(--primary)/0.08)]"                    >
                      {link.label}
                    </button>
                  )
                )}
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  Dashboard
                </Link>

                <Link
                  href="/projects"
                  className="text-sm text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  Projects
                </Link>

                <Link
                  href="/tasks"
                  className="text-sm text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  Tasks
                </Link>
              </>
            )}
          </nav>

          {/* Desktop actions */}

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
className="rounded-xl border border-transparent px-4 py-2.5 text-sm text-[rgb(var(--muted))] transition-all duration-200 hover:border-[rgb(var(--primary)/0.16)] hover:bg-[rgb(var(--primary)/0.05)] hover:text-[rgb(var(--foreground))] hover:shadow-[0_0_16px_rgb(var(--primary)/0.08)]"                >
                  Sign in
                </Link>

                <Link
                  href="/register"
className="inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary-foreground))] shadow-[0_0_18px_rgb(var(--primary)/0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_26px_rgb(var(--primary)/0.38)]"                >
                  Get started
                  <ArrowRight size={15} />
                </Link>
              </>
            ) : (
<Link
  href="/dashboard"
  className="group flex items-center gap-2.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm transition-all duration-200 hover:border-[rgb(var(--primary)/0.2)] hover:bg-[rgb(var(--surface-muted))] hover:shadow-[0_0_18px_rgb(var(--primary)/0.10)]"
>
  <span className="rounded-full bg-gradient-to-br from-sky-400 via-[rgb(var(--primary))] to-violet-500 p-[2px] shadow-[0_0_14px_rgb(var(--primary)/0.42)] transition-all duration-200 group-hover:shadow-[0_0_20px_rgb(var(--primary)/0.58)]">
    {user?.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt=""
        className="h-7 w-7 rounded-full object-cover"
      />
    ) : (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[rgb(var(--surface))] text-xs font-semibold text-[rgb(var(--primary))]">
        {user?.name
          ?.slice(0, 2)
          .toUpperCase()}
      </span>
    )}
  </span>

  <span className="max-w-24 truncate font-medium">
    {user?.name}
  </span>
</Link>
            )}
          </div>

          {/* Mobile trigger */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={
              mobileOpen
            }
            onClick={() =>
              setMobileOpen(
                (value) =>
                  !value
              )
            }
className="grid h-10 w-10 place-items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition-all duration-200 hover:border-[rgb(var(--primary)/0.22)] hover:bg-[rgb(var(--surface-muted))] hover:shadow-[0_0_18px_rgb(var(--primary)/0.12)] md:hidden"          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Mobile drawer */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.22,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="border-t border-[rgb(var(--border))] bg-[rgb(var(--background)/0.96)] backdrop-blur-xl md:hidden"
            >
              <div className="container-shell py-4">
                {!isAuthenticated ? (
                  <div className="space-y-1">
                    {sectionLinks.map(
                      (link) => (
                        <button
                          key={link.id}
                          type="button"
                          onClick={() =>
                            scrollToSection(
                              link.id
                            )
                          }
className="block w-full rounded-xl border border-transparent px-3 py-3 text-left text-sm text-[rgb(var(--muted))] transition-all duration-200 hover:border-[rgb(var(--primary)/0.16)] hover:bg-[rgb(var(--primary)/0.05)] hover:text-[rgb(var(--foreground))] hover:shadow-[0_0_16px_rgb(var(--primary)/0.08)]"                        >
                          {link.label}
                        </button>
                      )
                    )}

                    <Link
                      href="/login"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
className="block rounded-xl border border-transparent px-3 py-3 text-sm text-[rgb(var(--muted))] transition-all duration-200 hover:border-[rgb(var(--primary)/0.16)] hover:bg-[rgb(var(--primary)/0.05)] hover:text-[rgb(var(--foreground))] hover:shadow-[0_0_16px_rgb(var(--primary)/0.08)]"                    >
                      Sign in
                    </Link>

                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[rgb(var(--surface-muted))]"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/projects"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[rgb(var(--surface-muted))]"
                    >
                      Projects
                    </Link>

                    <Link
                      href="/tasks"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[rgb(var(--surface-muted))]"
                    >
                      Tasks
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[rgb(var(--surface-muted))]"
                    >
                      Profile
                    </Link>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--border))] pt-3">
                  <span className="text-sm text-[rgb(var(--muted))]">
                    Theme
                  </span>

                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/*
       * Navbar spacer.
       *
       * The header is fixed, so content needs
       * exactly 64px of top space.
       */}
      <div
        aria-hidden="true"
        className="h-16"
      />
    </>
  );
}