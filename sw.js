
const CACHE_NAME = 'admbazzar-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://i.ibb.co/hxH3NTDF/360-F-544950008_jizrelzjnj0za-U4e-Bc-Deo4-E0-I7qk-JQs-X.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
