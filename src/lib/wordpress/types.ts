export interface WpRenderedField {
  rendered: string;
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
  description?: string;
  count?: number;
  parent?: number;
}

export interface WpMediaDetails {
  source_url?: string;
}

export interface WpEmbeddedMedia {
  source_url: string;
  alt_text?: string;
  media_details?: WpMediaDetails;
}

export interface WpPost {
  id: number;
  slug: string;
  title: WpRenderedField;
  content?: WpRenderedField;
  excerpt?: WpRenderedField;
  featured_media: number;
  acf?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  "cafe-category"?: number[];
  "events-category"?: number[];
  "events-categroy"?: number[];
  product_cat?: number[];
  _embedded?: {
    "wp:featuredmedia"?: WpEmbeddedMedia[];
    "wp:term"?: WpTerm[][];
  };
}

// ─── WooCommerce Store API (بدون نیاز به کلید) ───────────────────────────
export interface WcStoreImage {
  src: string;
  alt?: string;
}

export interface WcStoreCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcStoreProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  images?: WcStoreImage[];
  categories?: WcStoreCategory[];
}

// ─── WooCommerce REST API v3 (نیاز به consumer key/secret) ──────────────
export interface WcRestImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
}

export interface WcRestCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcRestProduct {
  id: number;
  name: string;
  slug: string;
  status?: string;
  description?: string;
  short_description?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  /** آرایه تصاویر محصول — اولی تصویر اصلیه */
  images?: WcRestImage[];
  categories?: WcRestCategory[];
  /** تگ‌های محصول */
  tags?: { id: number; name: string; slug: string }[];
  /** متادیتا سفارشی */
  meta_data?: { id: number; key: string; value: unknown }[];
}