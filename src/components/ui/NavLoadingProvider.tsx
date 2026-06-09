"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface NavLoadingCtx {
  startLoading: () => void;
}

const NavLoadingContext = createContext<NavLoadingCtx>({ startLoading: () => {} });

export function useNavLoading() {
  return useContext(NavLoadingContext);
}

export function NavLoadingProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When pathname actually changes → start hiding after brief show
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      // Keep visible a tiny bit so it feels intentional, then fade out
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 120);
    }
  }, [pathname]);

  const startLoading = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
  }, []);

  return (
    <NavLoadingContext.Provider value={{ startLoading }}>
      {children}
      <NavLoadingOverlay visible={visible} />
    </NavLoadingContext.Provider>
  );
}

// ─── Overlay UI ────────────────────────────────────────────────────────────
import { Logo } from "@/components/ui/Logo";

function NavLoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-narhan-charcoal transition-opacity duration-250 ease-in-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
      aria-live="polite"
      aria-label="در حال بارگذاری"
    >
      <div
        className={`flex flex-col items-center gap-5 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-3"
        }`}
      >
        {/* Logo with subtle pulse */}
        <div
          className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <Logo width={48} height={61} />
        </div>

        {/* Shimmer progress bar */}
        <div className="relative h-px w-20 overflow-hidden rounded-full bg-white/10">
          <div
            className={`absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-narhan-accent to-transparent transition-opacity duration-300 ${
              visible ? "animate-[navShimmer_0.9s_ease-in-out_infinite] opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
