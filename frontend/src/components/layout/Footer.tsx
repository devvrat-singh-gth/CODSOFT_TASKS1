import Link from "next/link";
import {
  ArrowUpRight,
  Github,
  Instagram,
  Mail,
} from "lucide-react";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/45">
      <Container className="py-12 sm:py-14 xl:py-16 2xl:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          {/* Brand */}
          <div className="max-w-sm">
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

            <p className="mt-4 text-[clamp(0.8rem,0.85vw,0.95rem)] leading-6 text-foreground/55">
              A modern ecommerce experience for discovering electronics,
              fashion, home products and everyday essentials.
            </p>

            <div className="mt-5 flex items-center gap-2">
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

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
              Shop
            </h3>

            <nav className="mt-4 space-y-3">
              <Link
                href="/products"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                All products
              </Link>

              <Link
                href="/categories"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Categories
              </Link>

              <Link
                href="/wishlist"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Cart
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
              Account
            </h3>

            <nav className="mt-4 space-y-3">
              <Link
                href="/login"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Create account
              </Link>

              <Link
                href="/profile"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Profile
              </Link>

              <Link
                href="/orders"
                className="block text-[clamp(0.8rem,0.85vw,0.95rem)] text-foreground/60 transition-colors hover:text-primary"
              >
                Orders
              </Link>
            </nav>
          </div>

          {/* About */}
          <div>
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

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} AuraBazaar. All rights reserved.
          </p>

          <p>
            a <span className="brand-accent font-medium">UR</span> bazaar.
          </p>
        </div>
      </Container>
    </footer>
  );
}