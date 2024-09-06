const CACHE_NAME = 'app-cache';
const urlsToCache = [
  "icons/192.webp",
  "icons/256.webp",
  "static/js/app.e93035ead7e1694ffba7.js",
  "static/js/manifest.3c35ad9e444ab6d8b746.js",
  "static/js/vendor.112b0ef61d8725bfddbb.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
