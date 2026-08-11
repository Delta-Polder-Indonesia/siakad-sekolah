// Simple Service Worker for Portal SIAKAD — cache-first for immutable assets
// Improves repeat-visit performance and mitigates GitHub Pages 10m cache limit (PSI "Use efficient cache lifetimes")
const CACHE_NAME = 'siakad-v1';
const IMMUTABLE_CACHE = 'siakad-immutable-v1';

// Assets with hash in filename are immutable — cache 1 year
const isImmutable = (url) => {
  return (
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/images/') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  );
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME && k !== IMMUTABLE_CACHE) {
            return caches.delete(k);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only GET
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Skip cross-origin (Google Fonts, OAuth, etc.) — let browser handle
  if (url.origin !== location.origin) return;
  // Skip admin/API
  if (url.pathname.includes('/api/')) return;

  if (isImmutable(url)) {
    // Cache-first for immutable hashed assets & images
    event.respondWith(
      caches.open(IMMUTABLE_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              if (res.ok) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
        })
      )
    );
  } else {
    // Network-first for HTML / navigation
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
