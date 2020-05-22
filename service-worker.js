const CACHE_NAME = 'cache-v1'
const DATA_CACHE_NAME = 'data-cache-v1'

const PRE_CACHE = ['/index.html', '/styles.css', '/script.js', 'images/icons.png']


//On install - as a dependency
self.addEventListener('install', e => {
  e.waitUntil(async function() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([PRE_CACHE]);
  }());
});

//Clean-up & migration.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
})

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

