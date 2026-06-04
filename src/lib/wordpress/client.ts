import { getWpRestUrl, wpConfig } from "@/lib/wordpress/config";

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

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new WordPressApiError(
      "Invalid JSON response from WordPress",
      response.status,
      response.url,
    );
  }
}

export async function wpFetch<T>(
  path: string,
  params?: WpQueryParams,
  init?: RequestInit,
): Promise<T> {
  const url = `${getWpRestUrl(path)}${buildQuery(params)}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    next: {
      revalidate: wpConfig.revalidateSeconds,
      tags: [`wp:${path.split("?")[0]}`],
    },
  });

  if (!response.ok) {
    throw new WordPressApiError(
      `WordPress request failed (${response.status})`,
      response.status,
      url,
    );
  }

  return parseJson<T>(response);
}

export async function wpFetchAllPages<T>(
  path: string,
  params: WpQueryParams = {},
  perPage = 100,
  init?: RequestInit,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${getWpRestUrl(path)}${buildQuery({
      ...params,
      per_page: perPage,
      page,
    })}`;

    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
      next: {
        revalidate: wpConfig.revalidateSeconds,
        tags: [`wp:${path}`],
      },
    });

    if (!response.ok) {
      throw new WordPressApiError(
        `WordPress paginated request failed (${response.status})`,
        response.status,
        url,
      );
    }

    const batch = (await parseJson<T[]>(response)) ?? [];
    items.push(...batch);

    totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);
    page += 1;
  }

  return items;
}

export async function wcFetchAllPages<T>(
  path: string,
  params: WpQueryParams = {},
  perPage = 100,
): Promise<T[]> {
  const { consumerKey, consumerSecret } = wpConfig.woocommerce;
  const headers: HeadersInit = { Accept: "application/json" };

  if (consumerKey && consumerSecret) {
    const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    headers.Authorization = `Basic ${token}`;
  }

  return wpFetchAllPages<T>(path, params, perPage, { headers });
}
