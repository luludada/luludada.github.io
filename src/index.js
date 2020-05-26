require('../css/styles.css');

const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

function init() {
  let manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = '/manifest.json';
  document.head.appendChild(manifest);
  let title = document.createElement('h1');
  title.textContent = 'Top 10 Hacker News Stories';
  document.body.appendChild(title);
  let list = document.createElement('ol');
  document.body.appendChild(list);
  fetchTop10().then(stories => renderTop10(stories));
  
// Register A service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    const prefix = location.pathname.replace(/\/(index\.html)?$/, '');
    navigator.serviceWorker.register(`${prefix}/sw.js`)
      .then(function(registration) {
        // Registration was successful
        console.log('[success] scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('[fail]: ', err);
      });
  });
}
}

function fetchTop10() {
  return fetch(TOP_STORIES_URL).then(response => {
    return response.json();
  }).then(ids => {
    let top10Ids = ids.slice(0, 10);
    let urls = top10Ids.map(
      id => `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    let requests = urls.map(url => fetch(url).then(response => response.json()));
    return Promise.all(requests);
  });
}

function renderTop10(stories) {
  let list = document.querySelector('ol');
  list.innerHTML = '';
  stories.forEach(story => {
    let item = document.createElement('li');
    item.textContent = story.title;
    list.appendChild(item);
  });
}

init();

const elImg = document.createElement('img');
elImg.src = require('../images/icons.png');

document.body.appendChild(elImg);