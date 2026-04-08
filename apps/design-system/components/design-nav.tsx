"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/demo", label: "Demo" },
  { href: "/catalog", label: "Catalog" },
  { href: "/explorations", label: "Explorations" },
];

export function DesignNav() {
  const pathname = usePathname();

  // Hide nav on the full-screen demo page
  if (pathname.startsWith("/demo")) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-bg-surface border-b border-bg-elevated">
      <span className="text-sm font-semibold text-text-primary mr-4 font-serif">
        Frontpage DS
      </span>
      {navLinks.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              isActive
                ? "bg-bg-interactive text-text-primary"
                : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
