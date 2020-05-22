const cacheName = 'mysite-static-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('mysite-static-v1');
    console.log("Opened cache");
    await cache.addAll([
      '/index.html', 
      '/styles.css', 
      '/script.js', 
      'images/icons.png'
    ]);
  }());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
      }).map(cacheName => caches.delete(cacheName))
    );
  }());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(async function() {
    const cache = await caches.open('mysite-dynamic');
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;
    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    );
    return networkResponse;
  }());
});
