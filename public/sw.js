const CACHE_NAME = "narhan-v1";
const STATIC_ASSETS = [
  "/icons/logo.svg",
  "/fonts/modam/ModamFaNumWeb-Regular.woff2",
  "/fonts/modam/ModamFaNumWeb-Medium.woff2",
  "/fonts/modam/ModamFaNumWeb-SemiBold.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch(() => {})
        )
      )
    )
  );
  // بدون skipWaiting
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
    // بدون clients.claim()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // صفحات HTML و Next.js رو کاملاً رها کن
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/wp-json/") ||
    url.pathname.startsWith("/api/") ||
    event.request.headers.get("accept")?.includes("text/html")
  ) {
    return;
  }

  // فقط assets استاتیک: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response.ok) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});