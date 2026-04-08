"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Live Pulse" },
  { href: "/jobs", label: "Jobs" },
  { href: "/migration", label: "Migration" },
  { href: "/politics", label: "Politics" },
  { href: "/economy", label: "Economy" }
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-white/8 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-[0.24em] text-white">
          K-PULSE
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition",
                  active ? "bg-white text-slate-950" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
