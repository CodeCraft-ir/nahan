"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { SubNav } from "@/components/layout/SubNav";
import type { EventCategory, EventItem } from "@/lib/types";

interface EventsPageContentProps {
  categories: EventCategory[];
  items: EventItem[];
}

export function EventsPageContent({
  categories,
  items,
}: EventsPageContentProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id ?? "",
  );

  const filtered = useMemo(() => {
    const byCat = items.filter((e) => e.categoryId === activeCategory);
    return byCat.length > 0 ? byCat : items;
  }, [activeCategory, items]);

  if (categories.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-narhan-muted">
        رویدادی ثبت نشده است.
      </p>
    );
  }

  return (
    <>
      <SubNav
        items={categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="grid grid-cols-2 gap-3 px-4 py-5 pb-10">
        {filtered.length > 0 ? (
          filtered.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="col-span-2 py-8 text-center text-sm text-narhan-muted">
            رویدادی در این دسته نیست.
          </p>
        )}
      </div>
    </>
  );
}
