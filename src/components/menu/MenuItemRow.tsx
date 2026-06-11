import Image from "next/image";
import { formatPriceNumber } from "@/lib/utils/format";
import { designTokens } from "@/lib/design-tokens";
import type { MenuItem } from "@/lib/types";

interface MenuItemRowProps {
  item: MenuItem;
}

function MenuItemImage({ src, alt }: { src: string; alt: string }) {
  const { spacing } = designTokens;

  return (
    <div
      className="relative shrink-0 overflow-visible"
      style={{
        width: spacing.menuImagePlateWidth,
        height: spacing.menuImageSlotHeight,
      }}
    >
      <Image
        src="/icons/menu-item-plate.svg"
        alt=""
        width={spacing.menuImagePlateWidth}
        height={spacing.menuImagePlateHeight}
        className="absolute bottom-0 left-0"
        aria-hidden
      />
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={spacing.menuImageMaxWidth}
          height={spacing.menuImageMaxHeight}
          className="absolute bottom-1 left-1/2 z-10 h-auto w-auto max-h-none max-w-none -translate-x-1/2 object-contain object-bottom"
          style={{
            maxHeight: spacing.menuImageMaxHeight,
            maxWidth: spacing.menuImageMaxWidth,
          }}
        />
      ) : null}
    </div>
  );
}

export function MenuItemRow({ item }: MenuItemRowProps) {
  const { spacing, typography } = designTokens;

  return (
    <article
      className="flex items-end border-b border-white/10"
      style={{
        gap: spacing.menuRowGap,
        padding: `${spacing.menuRowPaddingY}px ${spacing.menuRowPaddingX}px`,
      }}
    >
      <MenuItemImage src={item.image} alt={item.title} />

      <div className="min-w-0 flex-1 pb-1 text-start pr-1">
        <h3
          className="text-white"
          style={{
            fontSize: typography.menuTitle.size,
            fontWeight: typography.menuTitle.weight,
          }}
        >
          {item.title}
        </h3>
        <p
          className="mt-0.5 leading-relaxed text-narhan-muted"
          style={{
            fontSize: typography.menuDesc.size,
            fontWeight: typography.menuDesc.weight,
          }}
        >
          {item.description}
        </p>
      </div>

      <div
        className="flex shrink-0 items-end justify-start pb-1"
        dir="ltr"
        style={{ width: spacing.priceWidth }}
      >
        <p
          className="flex items-baseline gap-1 text-white"
          style={{
            fontSize: typography.price.size,
            fontWeight: typography.price.weight,
          }}
        >
          <span>تومان</span>
          <span className="tabular-nums">{formatPriceNumber(item.price)}</span>
        </p>
      </div>
    </article>
  );
}
