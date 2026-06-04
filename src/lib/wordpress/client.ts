import { getWpRestUrl, wpConfig } from "@/lib/wordpress/config";

/** @deprecated فقط برای سازگاری؛ دیگر پرتاب نمی‌شود. */
export class WordPressApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "WordPressApiError";
  }
}

type QueryValue = string | number | boolean | undefined | null;

export type WpQueryParams = Record<string, QueryValue>;

function buildQuery(params?: WpQueryParams): string {
  if (!params) return "";

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

const wpFetchHeaders = {
  Accept: "application/json",
  "User-Agent": "NahanWeb/1.0 (+https://nahan.vercel.app)",
} as const;

export async function wpFetch<T>(
  path: string,
  params?: WpQueryParams,
  init?: RequestInit,
): Promise<T | null> {
  const url = `${getWpRestUrl(path)}${buildQuery(params)}`;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...wpFetchHeaders,
        ...init?.headers,
      },
      next: {
        revalidate: wpConfig.revalidateSeconds,
        tags: [`wp:${path.split("?")[0]}`],
      },
    });

    if (!response.ok) return null;

    return parseJson<T>(response);
  } catch {
    return null;
  }
}

export async function wpFetchAllPages<T>(
  path: string,
  params: WpQueryParams = {},
  perPage = 100,
  init?: RequestInit,
): Promise<T[] | null> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const url = `${getWpRestUrl(path)}${buildQuery({
        ...params,
        per_page: perPage,
        page,
      })}`;

      const response = await fetch(url, {
        ...init,
        headers: {
          ...wpFetchHeaders,
          ...init?.headers,
        },
        next: {
          revalidate: wpConfig.revalidateSeconds,
          tags: [`wp:${path}`],
        },
      });

      if (!response.ok) return null;

      const batch = (await parseJson<T[]>(response)) ?? [];
      if (!Array.isArray(batch)) return null;

      items.push(...batch);

      totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);
      page += 1;
    }

    return items;
  } catch {
    return null;
  }
}

export async function wcFetchAllPages<T>(
  path: string,
  params: WpQueryParams = {},
  perPage = 100,
): Promise<T[] | null> {
  const { consumerKey, consumerSecret } = wpConfig.woocommerce;
  const headers: HeadersInit = {};

  if (consumerKey && consumerSecret) {
    const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    headers.Authorization = `Basic ${token}`;
  }

  return wpFetchAllPages<T>(path, params, perPage, { headers });
}
