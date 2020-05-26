const cacheName = 'cache-v1'
const dataCacheName = 'data-cache-v1';

const preCache = [`/index.html`,  `/styles.css`,  `/scripts.js`,  `/images/icons.png`, `images/horse.svg`];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(PRE_CACHE)
        .then(() => self.skipWaiting());
    })
  );
});

//Clean-up & migration.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response
      }

      const fetchRequest = e.request.clone()

      return fetch(fetchRequest).then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200) {
          return response
        }

        const responseToCache = response.clone()

        caches.open(dataCacheName).then(cache => {
          cache.put(e.request, responseToCache)
        })

        return response
      })
    })
  )
})



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

