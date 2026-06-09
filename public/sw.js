// sw.js — placed in /public/sw.js
const CACHE_NAME = "nahan-v1";
const STATIC_ASSETS = [
  "/",
  "/menu",
  "/gallery",
  "/events",
  "/manifest.json",
  "/icons/logo.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
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
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first for API calls
  if (event.request.url.includes("/wp-json/")) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request)
      )
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          // Cache successful GET requests
          if (
            response.ok &&
            event.request.method === "GET" &&
            !event.request.url.includes("_next/webpack")
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, clone)
            );
          }
          return response;
        })
    )
  );
});