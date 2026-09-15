import type { ReactNode } from "react";
export default function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) { return <main className={`mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 ${className}`}>{children}</main>; }
