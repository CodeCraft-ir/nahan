import { MainTabs } from "@/components/layout/MainTabs";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { designTokens } from "@/lib/design-tokens";

interface AppShellProps {
  children: React.ReactNode;
  isOffline?: boolean;
}

export function AppShell({ children, isOffline = false }: AppShellProps) {
  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      {isOffline ? <OfflineNotice /> : null}
      <SiteHeader />
      <MainTabs />
      <main>{children}</main>
    </div>
  );
}
