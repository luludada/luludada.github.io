var cacheName = 'mysite-static-v1';
var preCache = ['./index.html', './styles.css', './script.js', './images/icons.png'];
importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e){
  console.log('SW install:', e);
  e.waitUntil(
    caches.open(cacheName)
    .then(function(cache){
      console.log('Opened cache: ', cache);
      return cache.addAll(preCache);
    })
    .then(function(cache){
      console.log('Cache completed');
    })
  )
});


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
 });

