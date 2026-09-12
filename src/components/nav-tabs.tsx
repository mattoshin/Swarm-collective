"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const APPS = [
  { href: "/directory", label: "Directory" },
  { href: "/meetings", label: "Meetings" },
  { href: "/charter", label: "The Charter" },
  { href: "/tools", label: "Tools" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/news", label: "News" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Apps"
      className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto"
    >
      {APPS.map((app, i) => {
        const active = pathname.startsWith(app.href);
        return (
          <Link
            key={app.href}
            href={app.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-[.1em] transition-colors motion-reduce:transition-none",
              active
                ? "border-term-green bg-term-green text-term-ink"
                : "border-transparent text-term-text/80 hover:border-term-line hover:text-term-green",
            )}
          >
            <span className={active ? undefined : "text-term-green"}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {app.label}
          </Link>
        );
      })}
    </nav>
  );
}
