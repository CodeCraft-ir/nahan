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

export interface WcRestProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price?: string;
  regular_price?: string;
  images?: { src: string; alt?: string }[];
  categories?: { id: number; name: string; slug: string }[];
}
