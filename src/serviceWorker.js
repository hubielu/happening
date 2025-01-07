// service-worker.js

const CACHE_NAME = 'network-insider-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/static/js/bundle.js',
  '/static/media/logo.svg', // Add more static files here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Delete outdated caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Cache-first strategy for static assets
  if (request.url.includes('/static/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return cached response if available
        }
        // Fetch from network if not in cache
        return fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Cache the new response
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Network-first strategy for other requests (HTML, API calls, etc.)
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request); // Fallback to cache if network fails
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
