"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { SubNav } from "@/components/layout/SubNav";
import type { GalleryCategory, GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export function GalleryGrid({ categories, items }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id ?? "",
  );

  const filtered = useMemo(() => {
    if (!activeCategory) return items;
    const byCat = items.filter((i) => i.categoryId === activeCategory);
    return byCat.length > 0 ? byCat : items;
  }, [activeCategory, items]);

  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-narhan-muted">
        محصولی در گالری ثبت نشده است.
      </p>
    );
  }

  return (
    <>
      {categories.length > 1 && (
        <SubNav
          items={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      )}
      <div className="grid grid-cols-2 gap-3 px-4 py-5 pb-10">
        {filtered.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-lg bg-narhan-card"
          >
            <div className="relative aspect-square bg-gradient-to-br from-narhan-image-bg/90 to-narhan-panel/40">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 50vw, 240px"
                />
              ) : null}
            </div>
            <figcaption className="p-3 text-center text-xs font-medium text-white">
              {item.title}
              {item.price ? (
                <span className="mt-0.5 block text-narhan-muted">
                  {item.price} تومان
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
