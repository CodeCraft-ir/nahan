"use client";

interface ScrollHintProps {
  onScroll?: () => void;
}

export function ScrollHint({ onScroll }: ScrollHintProps) {
  return (
    <div className="flex justify-center bg-white pb-8 pt-4">
      <button
        type="button"
        onClick={onScroll}
        className="rounded-full p-2 text-narhan-panel opacity-60 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-narhan-panel/30"
        aria-label="رفتن به منو"
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
          <path
            d="M2 2L10 10L18 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
