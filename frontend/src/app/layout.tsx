import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "aURaBazaar",
    template: "%s | aURaBazaar",
  },
  description: "A modern e-commerce storefront",
  icons: {
    icon: "/favicon1.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
            <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}