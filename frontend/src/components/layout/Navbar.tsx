"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Search,
  X,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDebounce } from "@/hooks/useDebounce";

export function Navbar() {
const router = useRouter();
const searchParams = useSearchParams();
const pathname = usePathname();

  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /*
   * Debounce search input so typing does not immediately
   * trigger a new URL update / API request on every key.
   */
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  /*
   * Keep the input synchronized with the URL.
   *
   * This matters when:
   * - ProductsPage is opened with ?search=...
   * - the user navigates using browser controls
   * - another part of the app changes the search parameter
   */
  useEffect(() => {
  if (pathname !== "/products") {
    return;
  }

  const currentSearch =
    searchParams.get("search") || "";

  const nextSearch =
    debouncedSearch.trim();

  if (currentSearch === nextSearch) {
    return;
  }

  const params = new URLSearchParams(
    window.location.search
  );

  if (nextSearch) {
    params.set(
      "search",
      nextSearch
    );
  } else {
    params.delete("search");
  }

  const query = params.toString();

  router.replace(
    query
      ? `/products?${query}`
      : "/products",
    {
      scroll: false,
    }
  );
}, [
  debouncedSearch,
  pathname,
  router,
  searchParams,
]);
  /*
   * Update the URL only after the user has stopped
   * typing for the debounce period.
   *
   * This is the important part that prevents:
   *
   * s     → request
   * sh    → request
   * shi   → request
   * shir  → request
   * shirt → request
   *
   * Instead we get:
   *
   * shirt → one request
   */
  useEffect(() => {
    const currentSearch =
      searchParams.get("search") || "";

    const nextSearch =
      debouncedSearch.trim();

    if (
      currentSearch === nextSearch
    ) {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    if (nextSearch) {
      params.set(
        "search",
        nextSearch
      );
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.replace(
      query
        ? `/products?${query}`
        : "/products",
      {
        scroll: false,
      }
    );
  }, [
    debouncedSearch,
    router,
    searchParams,
  ]);

  useEffect(() => {
    document.body.style.overflow =
      open ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
  };

  /*
   * Clicking/focusing the search box immediately
   * takes the user to the products page.
   *
   * The actual search query is still debounced.
   */
  const handleSearchFocus = () => {
    if (
      window.location.pathname !==
      "/products"
    ) {
      router.push("/products");
    }
  };

  /*
   * Only update local state while typing.
   *
   * No router.replace() here.
   *
   * useDebounce() handles the delayed URL update.
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
  };

  /*
   * Pressing Enter should still work immediately.
   *
   * This intentionally bypasses the debounce because
   * the user explicitly submitted the search.
   */
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    const params = new URLSearchParams(
      window.location.search
    );

    if (value) {
      params.set(
        "search",
        value
      );
    } else {
      params.delete("search");
    }

    const query = params.toString();

    if (
      window.location.pathname !==
      "/products"
    ) {
      router.push(
        query
          ? `/products?${query}`
          : "/products"
      );

      return;
    }

    router.replace(
      query
        ? `/products?${query}`
        : "/products",
      {
        scroll: false,
      }
    );
  };

  const initials = (() => {
    const name =
      user?.name?.trim();

    if (name) {
      const parts =
        name.split(/\s+/);

      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[
          parts.length - 1
        ][0]}`.toUpperCase();
      }

      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      user?.email
        ?.charAt(0)
        .toUpperCase() ||
      "U"
    );
  })();

  const Avatar = ({
    size = "desktop",
  }: {
    size?: "desktop" | "mobile";
  }) => {
    const isMobile =
      size === "mobile";

    return user?.avatar?.url ? (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${
          isMobile
            ? "h-8 w-8"
            : "h-8 w-8"
        }`}
      >
        <Image
          src={user.avatar.url}
          alt={`${
            user.name || "User"
          } profile picture`}
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>
    ) : (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground shadow-glow ring-2 ring-primary/10 ${
          isMobile
            ? "h-8 w-8 text-[10px]"
            : "h-8 w-8 text-[11px]"
        }`}
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  };

  return (
    <header className="navbar-shell sticky top-0 z-50 border-b border-border/70 backdrop-blur-2xl">
      <Container className="flex h-[clamp(3.9rem,4.4vw,4.6rem)] items-center gap-3">
        {/* =====================================================
            BRAND
            ===================================================== */}

          <Link
            href="/"
            className="group shrink-0"
            onClick={() => {
              setSearch("");
              closeMenu();
            }}
          >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-glow transition-transform duration-300 group-hover:rotate-3">
              A
            </span>

            <div className="hidden leading-none sm:block">
              <span className="block text-[15px] font-bold tracking-tight">
                A
                <span className="brand-accent">
                  ur
                </span>
                a
                <span className="brand-accent">
                  Bazaar
                </span>
              </span>

              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/40">
                a{" "}
                <span className="brand-accent">
                  UR
                </span>{" "}
                bazaar
              </span>
            </div>

            <span className="text-[15px] font-bold tracking-tight sm:hidden">
              A
              <span className="brand-accent">
                ur
              </span>
              a
              <span className="brand-accent">
                Bazaar
              </span>
            </span>
          </div>
        </Link>

        {/* =====================================================
            MOBILE SEARCH
            ===================================================== */}

        <form
          onSubmit={handleSearch}
          className="navbar-search-form min-w-0 flex-1 md:hidden"
        >
          <div className="navbar-search relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-foreground/40 transition-colors duration-200"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={
                handleSearchChange
              }
              onFocus={
                handleSearchFocus
              }
              placeholder="Search products..."
              aria-label="Search products"
              className="h-10 w-full rounded-xl border border-border/70 bg-card/55 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-foreground/38"
            />
          </div>
        </form>

        {/* =====================================================
            DESKTOP ACTIONS
            ===================================================== */}

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 md:flex lg:gap-2">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="rounded-xl p-2.5 text-foreground/65 transition-all hover:bg-primary/10 hover:text-primary"
          >
            <Heart className="h-[18px] w-[18px]" />
          </Link>

          {/* Desktop search */}

          <form
            onSubmit={handleSearch}
            className="navbar-search-form-desktop"
          >
            <div className="navbar-search relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-foreground/40 transition-colors duration-200"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={
                  handleSearchChange
                }
                onFocus={
                  handleSearchFocus
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="h-10 w-full rounded-xl border border-border/70 bg-card/55 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-foreground/38"
              />
            </div>
          </form>

          <Link
            href="/cart"
            aria-label={`Cart${
              itemCount > 0
                ? `, ${itemCount} items`
                : ""
            }`}
            className="relative rounded-xl p-2.5 text-foreground/65 transition-all hover:bg-primary/10 hover:text-primary"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />

            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground shadow-glow">
                {itemCount > 99
                  ? "99+"
                  : itemCount}
              </span>
            )}
          </Link>

          <Link
            href={
              user
                ? "/profile"
                : "/login"
            }
            aria-label={
              user
                ? "Account"
                : "Log in"
            }
            className="rounded-full p-1 transition-all duration-200 hover:bg-primary/10 hover:shadow-[0_0_18px_hsl(var(--primary)/0.22)]"
          >
            <Avatar />
          </Link>

          <div className="ml-1 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </div>

        {/* =====================================================
            MOBILE PROFILE BUTTON
            ===================================================== */}

        <button
          type="button"
          onClick={() =>
            setOpen(true)
          }
          aria-label="Open menu"
          aria-expanded={open}
          className="shrink-0 rounded-full p-0.5 transition-all duration-200 hover:bg-primary/10 hover:shadow-[0_0_18px_hsl(var(--primary)/0.25)] md:hidden"
        >
          <Avatar size="mobile" />
        </button>
      </Container>

      {/* =======================================================
          MOBILE DRAWER
          ======================================================= */}

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeMenu}
              className="fixed inset-0 z-[60] cursor-default bg-black/45 backdrop-blur-[3px]"
            />

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 0.24,
                ease: "easeOut",
              }}
              className="fixed right-0 top-0 z-[70] flex h-dvh w-[min(88vw,360px)] flex-col border-l border-border bg-background/90 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex h-[4rem] items-center justify-between border-b border-border px-5">
                <div className="flex items-center gap-3">
                  <Avatar size="mobile" />

                  <Link
                    href="/"
                    className="text-sm font-bold tracking-tight"
                    onClick={
                      closeMenu
                    }
                  >
                    A
                    <span className="brand-accent">
                      UR
                    </span>
                    a
                    <span className="brand-accent">
                      Bazaar
                    </span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={
                    closeMenu
                  }
                  aria-label="Close menu"
                  className="rounded-xl p-2 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Explore
                </p>

                <nav className="mt-3 space-y-1">
                  <Link
                    href="/products"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    Products
                    <ArrowRight className="h-4 w-4 text-foreground/35" />
                  </Link>

                  <Link
                    href="/categories"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    Categories
                    <ArrowRight className="h-4 w-4 text-foreground/35" />
                  </Link>
                </nav>

                <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Your space
                </p>

                <nav className="mt-3 space-y-1">
                  <Link
                    href={
                      user
                        ? "/profile"
                        : "/login"
                    }
                    onClick={
                      closeMenu
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <Avatar size="mobile" />

                    <span>
                      {user
                        ? "My profile"
                        : "Log in"}
                    </span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <Heart className="h-4 w-4 text-foreground/55" />
                    Wishlist
                  </Link>

                  <Link
                    href="/cart"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4 text-foreground/55" />
                      Cart
                    </span>

                    {itemCount >
                      0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {
                          itemCount
                        }
                      </span>
                    )}
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={
                        closeMenu
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4 text-foreground/55" />
                      Admin dashboard
                    </Link>
                  )}
                </nav>
              </div>

              <div className="border-t border-border p-5">
                <div className="glass rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">
                        Appearance
                      </p>

                      <p className="mt-0.5 text-[11px] text-foreground/45">
                        Choose your theme
                      </p>
                    </div>

                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}