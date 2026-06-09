const CACHE_NAME = "narhan-v1";
const STATIC_ASSETS = [
  "/",
  "/menu",
  "/gallery",
  "/events",
  "/icons/logo.svg",
  "/fonts/modam/ModamFaNumWeb-Regular.woff2",
  "/fonts/modam/ModamFaNumWeb-Medium.woff2",
  "/fonts/modam/ModamFaNumWeb-SemiBold.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // برای API و فایل‌های Next.js همیشه network-first
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/wp-json/") ||
    url.pathname.startsWith("/api/")
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // برای بقیه: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetched;
      })
    )
  );
});