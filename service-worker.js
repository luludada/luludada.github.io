self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('cache-v1').then(cache => {
      return cache.addAll([
        `/index.html`, 
        `/styles.css`, 
        `/scripts.js`, 
        `/images/icons.png`
      ])
        .then(() => self.skipWaiting());
    })
  );
});

//Clean-up & migration.

self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    console.log('Activating new service worker...');
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
    const networkResponsePromise = fetch(event.request);

    event.waitUntil(async function() {
      const networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    }());

    // Returned the cached response if we have one, otherwise return the network response.
    return cachedResponse || networkResponsePromise;
  }());
});




// self.addEventListener('fetch', event => {
//   event.respondWith( 
//     caches.match(event.request)
//      .then(response => {
//        return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(async function() {
//     const cache = await caches.open('mysite-dynamic');
//     const cachedResponse = await cache.match(event.request);
//     if (cachedResponse) return cachedResponse;
//     const networkResponse = await fetch(event.request);
//     event.waitUntil(
//       cache.put(event.request, networkResponse.clone())
//     );
//     return networkResponse;
//   }());
// });




// self.addEventListener('fetch', (event) => {
//   event.respondWith(async function() {
//     const cache = await caches.open('mysite-dynamic');
//     const cachedResponse = await cache.match(event.request);
//     const networkResponsePromise = fetch(event.request);

//     event.waitUntil(async function() {
//       const networkResponse = await networkResponsePromise;
//       await cache.put(event.request, networkResponse.clone());
//     }());

//     // Returned the cached response if we have one, otherwise return the network response.
//     return cachedResponse || networkResponsePromise;
//   }());
// });






// self.addEventListener('fetch', e => {
//   e.respondWith(
//     caches.match(e.request).then(response => {
//       if (response) {
//         return response
//       }

//       const fetchRequest = e.request.clone()

//       return fetch(fetchRequest).then(response => {
//         // Check if we received a valid response
//         if (!response || response.status !== 200) {
//           return response
//         }

//         const responseToCache = response.clone()

//         caches.open(DATA_CACHE_NAME).then(cache => {
//           cache.put(e.request, responseToCache)
//         })

//         return response
//       })
//     })
//   )
// })

