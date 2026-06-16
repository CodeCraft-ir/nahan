"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPriceNumber } from "@/lib/utils/format";
import type { GalleryItemDetail } from "@/lib/types";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function parsePriceString(value: string | undefined): number | null {
  if (!value) return null;
  const persian = value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const arabic = persian.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const digits = arabic.replace(/[^\d.]/g, "");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

interface Props {
  item: GalleryItemDetail;
}

export function GalleryItemDetailView({ item }: Props) {
  const regular = parsePriceString(item.price);
  const sale = parsePriceString(item.salePrice);
  const hasDiscount = sale !== null && regular !== null && sale !== regular;
  const displayPrice = sale ?? regular;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Image */}
      <div className="relative w-full bg-gradient-to-br from-narhan-card to-narhan-panel" style={{ aspectRatio: "1/1", maxHeight: 380 }}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 412px"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-narhan-charcoal/60 via-transparent to-transparent" />

        {/* back button */}
        <Link
          href="/gallery"
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-narhan-charcoal/60 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition hover:bg-narhan-charcoal/80"
          style={{ paddingTop: `max(env(safe-area-inset-top, 0px) + 6px, 6px)` }}
        >
          <BackIcon />
          <span>گالری</span>
        </Link>

        {/* discount badge */}
        {hasDiscount && regular && sale && (
          <span className="absolute left-4 top-4 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {Math.round(((regular - sale) / regular) * 100)}٪ تخفیف
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 px-5 pb-10 pt-5">
        {/* Category */}
        <span
          className="w-fit rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: "rgba(200,162,124,0.15)", color: "#c8a27c", border: "1px solid rgba(200,162,124,0.25)" }}
        >
          {item.categoryLabel}
        </span>

        {/* Title */}
        <h1 className="text-xl font-bold leading-snug text-white">
          {item.title}
        </h1>

        {/* Price */}
        {displayPrice !== null && (
          <div className="flex flex-col gap-1">
            {hasDiscount && regular && (
              <span className="text-sm text-narhan-muted line-through">
                {formatPriceNumber(regular)} تومان
              </span>
            )}
            <span className={`text-lg font-semibold ${hasDiscount ? "text-green-400" : "text-narhan-accent"}`}>
              {formatPriceNumber(displayPrice)} تومان
            </span>
          </div>
        )}
        {displayPrice === null && (
          <span className="text-sm text-narhan-muted">قیمت: تماس بگیرید</span>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-white/10" />

        {/* Description */}
        {item.description ? (
          <div
            className="text-sm leading-loose text-white/75"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ) : (
          <p className="text-sm leading-loose text-white/50">توضیحاتی برای این اثر ثبت نشده است.</p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <a
            href="tel:"
            className="flex w-full items-center justify-center rounded-xl bg-narhan-accent py-3.5 text-sm font-semibold text-narhan-charcoal transition hover:bg-narhan-accent-hover active:scale-95"
          >
            تماس برای سفارش
          </a>
          <Link
            href="/gallery"
            className="flex w-full items-center justify-center rounded-xl border border-white/15 py-3 text-sm text-white/60 transition hover:border-white/30 hover:text-white/80"
          >
            بازگشت به گالری
          </Link>
        </div>
      </div>
    </div>
  );
}
