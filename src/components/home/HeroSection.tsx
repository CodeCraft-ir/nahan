import { HeroClipMask } from "@/components/ui/HeroClipMask";
import { designTokens } from "@/lib/design-tokens";

export function HeroSection() {
  return (
    <section className="relative w-full flex-1 bg-white">
      <HeroClipMask />
    </section>
  );
}

export function HomeInfoSection() {
  const { typography } = designTokens;

  return (
    <section className="bg-white px-6 pt-8 text-narhan-panel">
      <div className="text-start">
        <p
          className="leading-relaxed"
          style={{
            fontSize: typography.address.size,
            fontWeight: typography.address.weight,
          }}
        >
          صفائیه، کوچه ۳۲، فرعی اول، شماره ۱۲۸
        </p>
        <p
          className="mt-2 text-start text-narhan-muted"
          dir="rtl"
          style={{
            fontSize: typography.brandEn.size,
            fontWeight: typography.brandEn.weight,
          }}
        >
          Nahan | Café-gallery
        </p>
      </div>
    </section>
  );
}
