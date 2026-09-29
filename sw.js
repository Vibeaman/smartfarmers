/* Smart Farmers — offline shell.
   Bump CACHE when you change site files. */
const CACHE = 'sf-v2';
const CORE = [
  './', './index.html', './styles.css', './app.js', './products.js',
  './img/logo.webp', './img/hero.webp', './favicon.ico',
  './img/icon-192.png', './img/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;

  // images: cache-first
  if (r.destination === 'image') {
    e.respondWith(
      caches.match(r).then(hit => hit || fetch(r).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(r, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // everything else: network-first, fall back to cache when offline
  e.respondWith(
    fetch(r).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(r, copy));
      return res;
    }).catch(() => caches.match(r).then(hit => hit || caches.match('./index.html')))
  );
});
