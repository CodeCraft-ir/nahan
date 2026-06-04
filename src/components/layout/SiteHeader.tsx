import { Logo } from "@/components/ui/Logo";
import { SITE_ADDRESS_FA, SITE_NAME_EN } from "@/lib/data/navigation";
import { designTokens } from "@/lib/design-tokens";

interface SiteHeaderProps {
  logoVisible?: boolean;
}

export function SiteHeader({ logoVisible = true }: SiteHeaderProps) {
  const { spacing, typography } = designTokens;

  return (
    <header
      className="flex items-start justify-between gap-4"
      style={{
        paddingTop: spacing.headerPaddingTop,
        paddingLeft: spacing.headerPaddingX,
        paddingRight: spacing.headerPaddingX,
      }}
    >
      <div
        className={`flex shrink-0 flex-col items-center gap-1 transition-all duration-500 ease-out ${
          logoVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: logoVisible ? "120ms" : "0ms" }}
      >
        <Logo width={41} height={52} />
        {/* <span className="text-[10px] font-medium leading-tight text-white/80">
          کافه گالری
        </span> */}
      </div>

      <div className="min-w-0 flex-1 text-end">
        <p
          className="leading-relaxed text-white/90"
          style={{ fontSize: typography.address.size }}
        >
          {SITE_ADDRESS_FA}
        </p>
        <p
          className="mt-1 text-start tracking-wide text-narhan-muted"
          dir="ltr"
          style={{ fontSize: typography.brandEn.size }}
        >
          {SITE_NAME_EN}
        </p>
      </div>
    </header>
  );
}
