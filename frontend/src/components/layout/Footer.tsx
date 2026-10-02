"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Github,
  Instagram,
  Mail,
} from "lucide-react";
import { Container } from "./Container";

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      setShowBackToTop(
        scrollPosition >= pageHeight - 400
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative border-t border-border/70 bg-background/45">
      <Container className="py-8 sm:py-12 xl:py-13 2xl:py-14">
        <div className="grid gap-7 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] md:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            {/* Mobile: logo + Shop button on the same row */}
            <div className="flex items-center justify-between gap-4 md:block">
              <Link
                href="/"
                className="group inline-flex items-center gap-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-glow transition-transform duration-300 group-hover:-rotate-3">
                  A
                </span>

                <div>
                  <span className="block text-base font-bold tracking-tight">
                    A
                    <span className="brand-accent">ur</span>
                    a
                    <span className="brand-accent">Bazaar</span>
                  </span>
                </div>
              </Link>

              {/* Mobile-only Shop button */}
              <Link
                href="/products"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card/50 px-3 py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary md:hidden"
              >
                Shop
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-3 text-[clamp(0.78rem,0.85vw,0.95rem)] leading-5 text-foreground/55 sm:mt-4 sm:leading-6">
              A modern ecommerce experience for discovering electronics,
              fashion, home products and everyday essentials.
            </p>

            <div className="mt-4 flex items-center gap-2 sm:mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-xl border border-border bg-card/50 p-2 text-foreground/50 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                href="#"
                aria-label="GitHub"
                className="rounded-xl border border-border bg-card/50 p-2 text-foreground/50 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>

              <a
                href="mailto:hello@aurabazaar.com"
                aria-label="Email"
                className="rounded-xl border border-border bg-card/50 p-2 text-foreground/50 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile compact navigation wrapper */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            {/* Shop */}
            <div>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/45 sm:text-xs">
                Shop
              </h3>

              <nav className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <Link
                  href="/products"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  All products
                </Link>

                <Link
                  href="/categories"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Categories
                </Link>

                <Link
                  href="/wishlist"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Wishlist
                </Link>

                <Link
                  href="/cart"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Cart
                </Link>
              </nav>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/45 sm:text-xs">
                Account
              </h3>

              <nav className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                <Link
                  href="/profile"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Profile
                </Link>

                <Link
                  href="/orders"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Orders
                </Link>
                <Link
                  href="/login"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                  <Link
                  href="/register"
                  className="block text-[clamp(0.78rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
                >
                  Create account
                </Link>
              </nav>
            </div>
          </div>

          {/* About - desktop only */}
          <div className="hidden md:block">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
              AuraBazaar
            </h3>

            <div className="mt-4 space-y-3 text-sm text-foreground/60">
              <p className="leading-6">
                Your everyday marketplace for discovering products that fit
                your style, space and routine.
              </p>

              <Link
                href="/products"
                className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
              >
                Start shopping
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 text-[0.68rem] text-foreground/40 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:pt-5 sm:text-xs">
          <p>
            © {new Date().getFullYear()} AuraBazaar. All rights reserved.
          </p>

          <p>
            a <span className="brand-accent font-medium">UR</span> bazaar.
          </p>
        </div>
      </Container>

      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/85 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-xl sm:bottom-6 sm:right-6 ${
          showBackToTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-90 opacity-0"
        }`}
      >
        <ArrowUp className="h-4.5 w-4.5" />
      </button>
    </footer>
  );
}