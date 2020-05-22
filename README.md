# luludada.github.io
luludada.github.io

## Feature:

* [] Work offline
* [] Improve the performance
* [] Support updated

### Register a service worker

Install a service worker, you need to register a service worker in html at first . 

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
<\script>
```

### Install a service worker



### Update a service worker


### Cache strategy with Workbox


