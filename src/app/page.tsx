import { HomeScrollPage } from "@/components/home/HomeScrollPage";
import { getMenuData } from "@/lib/wordpress";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { categories, groups } = await getMenuData();

  return <HomeScrollPage categories={categories} groups={groups} />;
}
