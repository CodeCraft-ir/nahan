"use client";

import { designTokens } from "@/lib/design-tokens";

interface SubNavProps {
  items: { id: string; label: string }[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function SubNav({ items, activeId, onSelect }: SubNavProps) {
  const { typography } = designTokens;

  return (
    <div className="mt-4 border-y border-white/10 bg-narhan-subnav">
      <div className="scrollbar-hide flex overflow-x-auto px-3 py-3" dir="rtl">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <div key={item.id} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={`whitespace-nowrap px-3 transition-colors ${
                  isActive
                    ? "font-semibold text-narhan-accent"
                    : "text-white/80 hover:text-white"
                }`}
                style={{
                  fontSize: typography.subnav.size,
                  fontWeight: isActive ? 600 : typography.subnav.weight,
                }}
              >
                {item.label}
              </button>
              {index < items.length - 1 && (
                <span className="text-white/20 select-none" aria-hidden>
                  |
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
