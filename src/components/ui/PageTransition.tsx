"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to allow paint, then fade in
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <>
      {/* Fade-in overlay — covers flash of unstyled content */}
      <div
        className="pointer-events-none fixed inset-0 z-40 bg-narhan-charcoal transition-opacity duration-300 ease-out"
        style={{ opacity: ready ? 0 : 1 }}
        aria-hidden
      />
      {children}
    </>
  );
}

/** Skeleton pulse rows for menu list */
export function MenuSkeleton() {
  return (
    <div className="pb-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-end gap-2 border-b border-white/10 px-5 py-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* image placeholder */}
          <div className="h-[86px] w-[106px] shrink-0 animate-pulse rounded-lg bg-white/8" />
          {/* text placeholder */}
          <div className="flex flex-1 flex-col gap-2 pb-1">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/8" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/6" />
          </div>
          {/* price placeholder */}
          <div className="h-3 w-16 animate-pulse rounded bg-white/8 pb-1" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton grid for gallery/events */
export function GridSkeleton({ cols = 2 }: { cols?: number }) {
  return (
    <div
      className="grid gap-3 px-4 py-5 pb-10"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg bg-narhan-card"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="aspect-square w-full animate-pulse bg-white/8" />
          <div className="p-3">
            <div className="mx-auto h-3 w-2/3 animate-pulse rounded bg-white/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Full-screen splash shown during navigation */
export function NavLoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-narhan-charcoal transition-all duration-400 ease-in-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div
        className={`flex flex-col items-center gap-6 transition-transform duration-400 ${
          visible ? "translate-y-0" : "translate-y-4"
        }`}
      >
        <Logo width={52} height={66} />
        {/* Subtle shimmer bar */}
        <div className="relative h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 animate-[shimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-narhan-accent/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
