import { MenuWithStickyHeader } from "@/components/menu/MenuWithStickyHeader";
import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { InstallAppButton } from "@/components/ui/InstallAppButton";
import { designTokens } from "@/lib/design-tokens";
import { getMenuData } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { categories, groups, isOffline } = await getMenuData();

  return (
    <div
      className="mx-auto min-h-screen w-full bg-narhan-charcoal"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      {isOffline ? <OfflineNotice /> : null}
      {groups.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-narhan-muted">
          آیتمی در منو ثبت نشده است.
        </p>
      ) : (
        <MenuWithStickyHeader categories={categories} groups={groups} />
      )}
      <InstallAppButton />
    </div>
  );
}
