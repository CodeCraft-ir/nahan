"use client";

import { MainTabs } from "@/components/layout/MainTabs";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { designTokens } from "@/lib/design-tokens";

interface StickyAppChromeProps {
  visible: boolean;
  subNav?: React.ReactNode;
  className?: string;
}

export function StickyAppChrome({
  visible,
  subNav,
  className = "",
}: StickyAppChromeProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 mx-auto bg-narhan-charcoal/95 shadow-lg backdrop-blur-md transition-[transform,opacity] duration-500 ease-out ${className} ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      style={{ maxWidth: designTokens.layout.maxWidth }}
      aria-hidden={!visible}
    >
      <SiteHeader logoVisible={visible} />
      <MainTabs />
      {subNav}
    </header>
  );
}
