/**
 * Elsewhere — Progressive Web App Service Worker
 *
 * Implements a respectful offline-first caching strategy for mindful reading:
 * 1. App Shell & Static Assets: Pre-cached and served cache-first / stale-while-revalidate.
 * 2. Navigations: Network-first with fallback to cached page or /offline fallback.
 * 3. News & Real-Time Content: STRICTLY network-first without caching stale breaking news
 *    as current (as required by product principles).
 */

const CACHE_VERSION = 'elsewhere-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Core assets required for offline app shell
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/challenges',
  '/explore',
  '/do-something',
  '/profile',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png',
];

// Install event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[Elsewhere SW] Pre-cache error:', err))
  );
});

// Activate event: Clean up previous cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith('elsewhere-') && name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event: Apply appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 2. Breaking News & Live Feeds: Network-only / Network-first with NO stale breaking caching
  // Principle: Never present stale breaking news or live dispatches as though it were current
  if (url.pathname.startsWith('/api/news')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            items: [],
            source: 'curated_fallback',
            isOffline: true,
            error: 'You are currently offline. Live dispatches will resume when connected.',
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // 3. HTML Navigation requests: Network-first, fallback to cache, then /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) return offlineFallback;

          return new Response('Offline — Elsewhere is ready when reconnected.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // 4. Next.js Static Chunks, Images, Fonts, Stylesheets: Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with Cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
