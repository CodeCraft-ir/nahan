import Image from "next/image";
import type { ReactNode } from "react";

const HERO_PATH =
  "M0 0H412V675.94L97.4613 722.556C46.1161 730.165 0 690.38 0 638.474L0 0Z";

interface HeroClipMaskProps {
  children?: ReactNode;
}

/** Exact clip from صفحه اصلی.svg — تصویر + لایه‌های رویی */
export function HeroClipMask({ children }: HeroClipMaskProps) {
  return (
    <div className="relative mx-auto w-full">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="narhan-hero-clip" clipPathUnits="objectBoundingBox">
            <path
              d={HERO_PATH}
              transform="scale(0.00242718447, 0.00138121547)"
            />
          </clipPath>
        </defs>
      </svg>
      <div className="relative aspect-[412/724] w-full overflow-hidden [clip-path:url(#narhan-hero-clip)]">
        <Image
          src="/images/hero-cafe.png"
          alt="فضای داخلی کافه نهان"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 412px) 100vw, 412px"
        />
        {children}
      </div>
    </div>
  );
}
