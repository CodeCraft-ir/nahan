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
      hideTimer.current = setTimeout(() => setVisible(false), 150);
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
          100% { transform: translateX(350%); }
        }
        @keyframes narhan-logo-breathe {
          0%, 100% { opacity: 0.65; transform: scale(0.97); }
          50%       { opacity: 1;    transform: scale(1); }
        }
        @keyframes narhan-dot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1); }
        }
        .narhan-dot:nth-child(1) { animation-delay: 0s; }
        .narhan-dot:nth-child(2) { animation-delay: 0.18s; }
        .narhan-dot:nth-child(3) { animation-delay: 0.36s; }
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
          gap: 0,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 220ms ease-in-out",
        }}
      >
        {/* لوگو */}
        <div
          style={{
            animation: visible
              ? "narhan-logo-breathe 1.8s ease-in-out infinite"
              : "none",
            marginBottom: 20,
          }}
        >
          <Logo width={44} height={56} />
        </div>

        {/* نوار shimmer */}
        <div
          style={{
            width: 44,
            height: 1.5,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, #c8a27c 50%, transparent 100%)",
              animation: visible
                ? "narhan-shimmer 1.3s ease-in-out infinite"
                : "none",
              width: "30%",
            }}
          />
        </div>

        {/* سه نقطه */}
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="narhan-dot"
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(200, 162, 124, 0.5)",
                animation: visible
                  ? `narhan-dot 1.3s ease-in-out infinite`
                  : "none",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}