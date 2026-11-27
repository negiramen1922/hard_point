// HARD POINT service worker
// 更新を配信するときは VERSION を上げてください（古いキャッシュが破棄されます）
const VERSION = 'hp-v4';
const CORE = [
  './',
  './index.html',
  './vendor/three.min.js',
  './manifest.webmanifest',
  './icon-512.png',
  './icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // ゲーム本体(HTML)はネット優先 → 最新版をすぐ反映、オフライン時はキャッシュ
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // お知らせ(news.json)はネット優先 → 追加したらすぐ届く、オフライン時はキャッシュ
  if (url.origin === location.origin && url.pathname.endsWith('/news.json')) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); return r; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // それ以外（three.js・アイコン・Googleフォント）はキャッシュ優先
  if (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
        return r;
      }))
    );
  }
});
