"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/products", label: "Algorithms" },
  { href: "/performance", label: "Performance" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-black/5 bg-white/75 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold text-white">
            D
          </span>
          <span>Drift</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#6e6e73] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-[#1d1d1f]",
                pathname.startsWith(l.href.replace("/#", "/")) && "text-[#1d1d1f]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-secondary px-4 py-2 text-sm">
            Sign in
          </Link>
          <Link href="/products" className="btn btn-primary px-4 py-2 text-sm">
            Browse algos
          </Link>
        </div>
      </div>
    </header>
  );
}
