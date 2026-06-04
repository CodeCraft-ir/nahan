"use client";

import { useRef, useState } from "react";
import { StickyAppChrome } from "@/components/layout/StickyAppChrome";
import { SubNav } from "@/components/layout/SubNav";
import {
  MenuSections,
  MENU_STICKY_OFFSET,
  useScrollToCategory,
} from "@/components/menu/MenuSections";
import type { MenuCategory, MenuGroup } from "@/lib/types";

interface MenuWithStickyHeaderProps {
  categories: MenuCategory[];
  groups: MenuGroup[];
}

export function MenuWithStickyHeader({
  categories,
  groups,
}: MenuWithStickyHeaderProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollingRef = useRef(false);
  const scrollToCategory = useScrollToCategory(sectionRefs, scrollingRef);

  const subNav = (
    <SubNav
      items={categories}
      activeId={activeCategory}
      onSelect={(id) => {
        setActiveCategory(id);
        scrollToCategory(id);
      }}
    />
  );

  return (
    <>
      <StickyAppChrome visible subNav={subNav} />
      <div style={{ height: MENU_STICKY_OFFSET }} aria-hidden />
      <MenuSections
        groups={groups}
        onCategoryVisible={setActiveCategory}
        sectionRefs={sectionRefs}
        scrollingRef={scrollingRef}
      />
    </>
  );
}
