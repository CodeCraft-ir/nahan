"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSection, HomeInfoSection } from "@/components/home/HeroSection";
import { StickyAppChrome } from "@/components/layout/StickyAppChrome";
import {
  MenuSections,
  MENU_STICKY_OFFSET,
  scrollToElementWithOffset,
  useScrollToCategory,
} from "@/components/menu/MenuSections";
import { SubNav } from "@/components/layout/SubNav";
import { ScrollHint } from "@/components/ui/ScrollHint";
import type { MenuCategory, MenuGroup } from "@/lib/types";
import { designTokens } from "@/lib/design-tokens";

interface HomeScrollPageProps {
  categories: MenuCategory[];
  groups: MenuGroup[];
}

export function HomeScrollPage({ categories, groups }: HomeScrollPageProps) {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const menuRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollingRef = useRef(false);
  const scrollToCategory = useScrollToCategory(sectionRefs, scrollingRef);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const showAt = MENU_STICKY_OFFSET;
    const hideAt = MENU_STICKY_OFFSET + 48;

    const updateSticky = () => {
      if (scrollingRef.current) return;
      const menuTop = menu.getBoundingClientRect().top;
      setStickyVisible((prev) =>
        prev ? menuTop <= hideAt : menuTop <= showAt,
      );
    };

    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, []);

  const scrollToMenu = () => {
    const menu = menuRef.current;
    if (!menu) return;
    setStickyVisible(true);
    scrollToElementWithOffset(menu, scrollingRef);
  };

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
    <div
      className="mx-auto min-h-screen w-full"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <StickyAppChrome visible={stickyVisible} subNav={subNav} />

      <div className="flex min-h-dvh flex-col bg-white">
        <HeroSection />
        <HomeInfoSection />
        <ScrollHint onScroll={scrollToMenu} />
      </div>

      <section
        ref={menuRef}
        id="menu"
        className="bg-narhan-charcoal"
        aria-label="منوی کافه"
      >
        <MenuSections
          groups={groups}
          onCategoryVisible={setActiveCategory}
          sectionRefs={sectionRefs}
          scrollingRef={scrollingRef}
        />
      </section>
    </div>
  );
}
