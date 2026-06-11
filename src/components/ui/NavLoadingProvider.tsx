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
import { Logo } from "@/components/ui/Logo";

interface NavLoadingCtx {
  startLoading: () => void;
}

const NavLoadingContext = createContext<NavLoadingCtx>({
  startLoading: () => {},
});

export function useNavLoading() {
  return useContext(NavLoadingContext);
}

export function NavLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 250);
    }
  }, [pathname]);

  const startLoading = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
  }, []);

  return (
    <NavLoadingContext.Provider value={{ startLoading }}>
      {children}
      <NarhanLoadingOverlay visible={visible} />
    </NavLoadingContext.Provider>
  );
}

function NarhanLoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <>
      <style>{`
        @keyframes narhan-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes narhan-breathe {
          0%, 100% { opacity: 0.7; transform: scale(0.96); }
          50%       { opacity: 1;   transform: scale(1); }
        }
        @keyframes narhan-glow {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50%       { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes narhan-dot {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>

      <div
        aria-hidden={!visible}
        aria-live="polite"
        aria-label="در حال بارگذاری"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#2a2a2a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 200ms ease-in-out",
        }}
      >
        {/* هاله نور پشت لوگو */}
        <div
          style={{
            position: "absolute",
            width: 110,
            height: 110,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,162,124,0.22) 0%, transparent 70%)",
            animationName: visible ? "narhan-glow" : "none",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />

        {/* لوگو */}
        <div
          style={{
            position: "relative",
            animationName: visible ? "narhan-breathe" : "none",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            marginBottom: 28,
          }}
        >
          <Logo width={52} height={66} />
        </div>

        {/* نوار shimmer */}
        <div
          style={{
            width: 52,
            height: 1,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 1,
            overflow: "hidden",
            position: "relative",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "28%",
              background:
                "linear-gradient(90deg, transparent, #c8a27c 50%, transparent)",
              animationName: visible ? "narhan-shimmer" : "none",
              animationDuration: "1.4s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
        </div>

        {/* سه نقطه */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 3.5,
                height: 3.5,
                borderRadius: "50%",
                background: "rgba(200, 162, 124, 0.55)",
                animationName: visible ? "narhan-dot" : "none",
                animationDuration: "1.2s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}