const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const siteUrl = trimTrailingSlash(
  process.env.WP_SITE_URL ?? "https://nahancafe.ir/nahanadmin",
);

export const wpConfig = {
  siteUrl,
  apiBase: `${siteUrl}/wp-json`,

  revalidateSeconds: Number(process.env.WP_REVALIDATE_SECONDS ?? 300),

  postTypes: {
    menuItems: process.env.WP_MENU_POST_TYPE ?? "cmenu-items",
    events: process.env.WP_EVENTS_POST_TYPE ?? "events",
  },

  taxonomies: {
    menuCategories: process.env.WP_MENU_TAXONOMY ?? "cafe-category",
    eventCategories: process.env.WP_EVENTS_TAXONOMY ?? "events-category",
    productCategories: process.env.WP_PRODUCT_TAXONOMY ?? "product_cat",
  },

  woocommerce: {
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
  },

  useStaticFallback:
    process.env.WP_USE_STATIC_FALLBACK === "true" ||
    process.env.NODE_ENV === "development",
} as const;

export function getWpRestUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${wpConfig.apiBase}${normalized}`;
}
