import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import ThemeProvider from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkOrbit",
  description:
    "Plan projects, manage tasks, and stay on track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html
  lang="en"
  suppressHydrationWarning
  data-scroll-behavior="smooth"
>
      <body className={inter.variable}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}