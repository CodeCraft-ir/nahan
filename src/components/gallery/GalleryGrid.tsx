import Image from "next/image";
import type { GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-narhan-muted">
        محصولی در گالری ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-5 pb-10">
      {items.map((item) => (
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
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
