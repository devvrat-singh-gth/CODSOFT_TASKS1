"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function ProductSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="pl-9"
      />
    </div>
  );
}
