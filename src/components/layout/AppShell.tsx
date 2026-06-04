import { MainTabs } from "@/components/layout/MainTabs";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { designTokens } from "@/lib/design-tokens";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <SiteHeader />
      <MainTabs />
      <main>{children}</main>
    </div>
  );
}
