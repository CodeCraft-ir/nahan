"use client";

import { usePWA } from "@/context/PWAContext";

export function PwaInstallButton() {
  const { canInstall, install } = usePWA();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={install}
      className="flex items-center gap-2 rounded-full bg-narhan-accent px-4 py-2 text-xs font-medium text-narhan-charcoal transition hover:bg-narhan-accent-hover"
      aria-label="نصب اپلیکیشن نهان"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3v13M8 12l4 4 4-4" />
        <path d="M4 20h16" />
      </svg>
      <span>نصب اپ</span>
    </button>
  );
}
