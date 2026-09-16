import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container-shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-semibold"
          >
            WorkOrbit
          </Link>

          <p className="mt-1 text-xs opacity-50">
            Simple project management for focused work.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm opacity-60">
          <a
            href="#features"
            className="transition hover:opacity-100"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:opacity-100"
          >
            How it works
          </a>

          <Link
            href="/login"
            className="transition hover:opacity-100"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="transition hover:opacity-100"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="border-t">
        <div className="container-shell py-5 text-xs opacity-40">
          © {new Date().getFullYear()} WorkOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}