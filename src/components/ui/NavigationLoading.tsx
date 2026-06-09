"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { NavLoadingOverlay } from "@/components/ui/PageTransition";

function NavigationLoadingInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(pathname + searchParams.toString());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current !== prevPath.current) {
      // New route — show loader briefly then hide
      setLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setLoading(false);
        prevPath.current = current;
      }, 350);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  return <NavLoadingOverlay visible={loading} />;
}

export function NavigationLoading() {
  return (
    <Suspense>
      <NavigationLoadingInner />
    </Suspense>
  );
}
