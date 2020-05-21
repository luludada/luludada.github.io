const CACHE_NAME = 'cache-v1'
const DATA_CACHE_NAME = 'data-cache-v1'

const PRE_CACHE = ['/index.html', '/css/app.css', '/js/app.js']

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRE_CACHE)
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

        caches.open(DATA_CACHE_NAME).then(cache => {
          cache.put(e.request, responseToCache)
        })

        return response
      })
    })
  )
})

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