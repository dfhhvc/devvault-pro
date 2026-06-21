/**
 * Service Worker for DevVault Pro PWA
 * Implements stale-while-revalidate caching for offline support.
 * All resources are served locally — no external data requests.
 *
 * FIX: Uses self.registration.scope to dynamically determine the base path,
 * so caching works correctly regardless of deployment path
 * (GitHub Pages /devvault-pro/ or Docker root /).
 */

const CACHE_NAME = "devvault-pro-v3";

/**
 * Dynamically determine the base path from the SW registration scope.
 * This ensures cache URLs match actual asset URLs regardless of basePath.
 */
const BASE_PATH = new URL(self.registration.scope).pathname;

const STATIC_ASSETS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.json",
  BASE_PATH + "favicon.ico",
  BASE_PATH + "icon-16.png",
  BASE_PATH + "icon-32.png",
  BASE_PATH + "icon-48.png",
  BASE_PATH + "icon-72.png",
  BASE_PATH + "icon-96.png",
  BASE_PATH + "icon-128.png",
  BASE_PATH + "icon-144.png",
  BASE_PATH + "icon-152.png",
  BASE_PATH + "icon-192.png",
  BASE_PATH + "icon-384.png",
  BASE_PATH + "icon-512.png",
  BASE_PATH + "apple-touch-icon.png",
];

/**
 * Install: Cache static assets
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

/**
 * Activate: Clean up old caches
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/**
 * Fetch: Stale-while-revalidate strategy
 * - Serve from cache immediately (offline support)
 * - Fetch from network in background (update cache)
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests (safety check)
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      // Return cached response immediately
      if (cachedResponse) {
        // Revalidate in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        }).catch(() => {
          // Network failed, cached version is already served
        });

        return cachedResponse;
      }

      // Not in cache: fetch from network
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Network failed and not in cache
        return new Response("Offline — resource not cached", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" },
        });
      }
    })
  );
});
