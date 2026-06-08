/**
 * Service Worker for DevVault PWA
 * Caches all static assets for complete offline use.
 * All resources are served locally — no external data requests.
 */

const CACHE_NAME = "devvault-pro-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon-16.png",
  "/icon-32.png",
  "/icon-48.png",
  "/icon-72.png",
  "/icon-96.png",
  "/icon-128.png",
  "/icon-144.png",
  "/icon-152.png",
  "/icon-192.png",
  "/icon-384.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

/**
 * Cache all _next static assets during install.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);
      // Cache all _next static assets
      const nextAssets = [
        "/_next/static/css/",
        "/_next/static/chunks/",
        "/_next/static/media/",
      ];
      for (const path of nextAssets) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            await cache.put(path, response);
          }
        } catch {
          // Ignore failed precaching
        }
      }
    })
  );
  self.skipWaiting();
});

/**
 * Clean up old caches on activate.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/**
 * Stale-while-revalidate strategy for all requests.
 * Serves from cache immediately, then updates cache in background.
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
