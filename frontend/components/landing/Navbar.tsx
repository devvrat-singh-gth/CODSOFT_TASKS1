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
            className="flex items-center gap-2"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgb(var(--primary))] text-sm font-bold text-[rgb(var(--primary-foreground))]">
              P
            </span>

            <span className="text-lg font-semibold tracking-tight">
              ProjectFlow
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
                      className="text-sm text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                    >
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
                  className="rounded-xl px-4 py-2.5 text-sm text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--primary-foreground))] transition hover:brightness-110"
                >
                  Get started
                  <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-muted))]"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[rgb(var(--primary)/0.15)] text-xs font-semibold text-[rgb(var(--primary))]">
                    {user?.name
                      ?.slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}

                <span className="max-w-24 truncate">
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
            className="grid h-10 w-10 place-items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition hover:bg-[rgb(var(--surface-muted))] md:hidden"
          >
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
                          className="block w-full rounded-xl px-3 py-3 text-left text-sm text-[rgb(var(--muted))] transition-colors hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
                        >
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
                      className="block rounded-xl px-3 py-3 text-sm text-[rgb(var(--muted))] transition-colors hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
                    >
                      Sign in
                    </Link>

                    <Link
                      href="/register"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-medium text-[rgb(var(--primary-foreground))]"
                    >
                      Get started
                      <ArrowRight
                        size={15}
                      />
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