"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_TABS } from "@/lib/data/navigation";
import { designTokens } from "@/lib/design-tokens";
import type { MainTabId } from "@/lib/types";

function tabFromPath(pathname: string): MainTabId | null {
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname.startsWith("/events")) return "events";
  if (pathname === "/" || pathname.startsWith("/menu")) return "menu";
  return null;
}

export function MainTabs() {
  const pathname = usePathname();
  const active = tabFromPath(pathname);
  const { spacing, typography } = designTokens;

  return (
    <nav
      className="mt-5 flex justify-center border-b border-white/10"
      style={{ gap: spacing.tabGap, paddingLeft: spacing.headerPaddingX, paddingRight: spacing.headerPaddingX }}
      aria-label="ناوبری اصلی"
    >
      {MAIN_TABS.map((tab) => {
        const isActive = active !== null && tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`relative pb-3 transition-colors ${
              isActive ? "text-narhan-accent" : "text-white/70 hover:text-white"
            }`}
            style={{
              fontSize: typography.tab.size,
              fontWeight: typography.tab.weight,
            }}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-narhan-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
