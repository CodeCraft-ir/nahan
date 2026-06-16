"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SubNav } from "@/components/layout/SubNav";
import { formatPriceNumber } from "@/lib/utils/format";
import type { GalleryCategory, GalleryItem } from "@/lib/types";

function parsePriceString(value: string | undefined): number | null {
  if (!value) return null;
  const persian = value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const arabic = persian.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const digits = arabic.replace(/[^\d.]/g, "");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function GalleryItemPrice({
  price,
  salePrice,
}: {
  price?: string;
  salePrice?: string;
}) {
  const regular = parsePriceString(price);
  const sale = parsePriceString(salePrice);

  if (regular === null && sale === null) {
    return <span className="mt-0.5 block text-narhan-muted">ناموجود</span>;
  }

  if (sale !== null && regular !== null && sale !== regular) {
    return (
      <span className="mt-0.5 block space-y-0.5">
        <span className="block text-narhan-muted line-through">
          {formatPriceNumber(regular)} تومان
        </span>
        <span className="block text-green-400">
          {formatPriceNumber(sale)} تومان
        </span>
      </span>
    );
  }

  const shown = sale ?? regular!;
  return (
    <span className="mt-0.5 block text-narhan-muted">
      {formatPriceNumber(shown)} تومان
    </span>
  );
}

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
          <Link
            key={item.id}
            href={`/gallery/${item.id}`}
            className="overflow-hidden rounded-lg bg-narhan-card active:scale-95 transition-transform"
          >
            <figure>
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
                <GalleryItemPrice price={item.price} salePrice={item.salePrice} />
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </>
  );
}
