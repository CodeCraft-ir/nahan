"use client";

import { useCallback, useEffect, useRef } from "react";
import { MenuItemRow } from "@/components/menu/MenuItemRow";
import type { MenuGroup } from "@/lib/types";

export const MENU_STICKY_OFFSET = 188;
export const SCROLL_LOCK_MS = 650;

export function scrollToElementWithOffset(
  el: HTMLElement,
  scrollingRef: React.MutableRefObject<boolean>,
  offset = MENU_STICKY_OFFSET,
) {
  scrollingRef.current = true;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(() => {
    scrollingRef.current = false;
  }, SCROLL_LOCK_MS);
}

/** Last category whose section top has reached the sticky anchor line. */
export function getActiveCategoryFromScroll(
  sectionRefs: Record<string, HTMLElement | null>,
  categoryIds: string[],
): string {
  let activeId = categoryIds[0];
  for (const id of categoryIds) {
    const el = sectionRefs[id];
    if (!el) continue;
    if (el.getBoundingClientRect().top <= MENU_STICKY_OFFSET + 4) {
      activeId = id;
    }
  }
  return activeId;
}

interface MenuSectionsProps {
  groups: MenuGroup[];
  onCategoryVisible: (categoryId: string) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  scrollingRef?: React.MutableRefObject<boolean>;
}

export function MenuSections({
  groups,
  onCategoryVisible,
  sectionRefs,
  scrollingRef,
}: MenuSectionsProps) {

  useEffect(() => {
    const categoryIds = groups.map(({ category }) => category.id);

    const updateActive = () => {
      if (scrollingRef?.current) return;
      onCategoryVisible(
        getActiveCategoryFromScroll(sectionRefs.current, categoryIds),
      );
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [groups, onCategoryVisible, sectionRefs, scrollingRef]);

  return (
    <div className="pb-12 overflow-visible">
      {groups.map(({ category, items }) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          data-category-id={category.id}
          ref={(el) => {
            sectionRefs.current[category.id] = el;
          }}
          className="scroll-mt-[188px]"
        >
          {items.length > 0 ? (
            items.map((item) => <MenuItemRow key={item.id} item={item} />)
          ) : (
            <p className="border-b border-white/10 px-5 py-6 text-center text-xs text-narhan-muted">
              به‌زودی
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

export function useScrollToCategory(
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>,
  scrollingRef: React.MutableRefObject<boolean>,
) {
  return useCallback(
    (categoryId: string) => {
      const el = sectionRefs.current[categoryId];
      if (!el) return;
      const scrollTarget =
        (el.querySelector("article") as HTMLElement | null) ?? el;
      scrollToElementWithOffset(scrollTarget, scrollingRef);
    },
    [sectionRefs, scrollingRef],
  );
}
