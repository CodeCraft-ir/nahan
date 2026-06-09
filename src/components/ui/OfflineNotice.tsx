"use client";

import { useState } from "react";

interface OfflineNoticeProps {
  className?: string;
}

export function OfflineNotice({ className = "" }: OfflineNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      className={`relative flex items-start justify-between gap-3 border-b border-amber-500/30 bg-amber-950/90 px-4 py-3 text-sm leading-relaxed text-amber-100 ${className}`.trim()}
    >
      <div>
        <p className="font-medium">اتصال به سرور برقرار نیست</p>
        <p className="mt-0.5 text-xs text-amber-200/80">
          در حال نمایش داده‌های آفلاین (نمونه)
        </p>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-0.5 shrink-0 rounded-full p-1 text-amber-300/70 transition hover:bg-amber-500/20 hover:text-amber-100"
        aria-label="بستن"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </button>
    </div>
  );
}
