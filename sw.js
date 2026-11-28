// HARD POINT service worker
// 更新を配信するときは VERSION を上げてください（古いキャッシュが破棄されます）
const VERSION = 'hp-v7';
// 本番(/hard_point/)とテスト版(/hard_point/test/)は同じドメインなので、キャッシュ名に置き場所を含めて混ざらないようにする
const SCOPE = new URL(self.registration.scope).pathname;
const CACHE = VERSION + '@' + SCOPE;
const CORE = [
  './',
  './index.html',
  './vendor/three.min.js',
  './manifest.webmanifest',
  './icon-512.png',
  './icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => (k.endsWith('@' + SCOPE) || !k.includes('@')) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // テスト版(test/以下)は本番の service worker では扱わない
  if (url.origin === location.origin && url.pathname.startsWith(SCOPE) && url.pathname.slice(SCOPE.length).startsWith('test/')) return;

  // ゲーム本体(HTML)はネット優先 → 最新版をすぐ反映、オフライン時はキャッシュ
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(new URL('./index.html', self.registration.scope).href, c)); return r; })
        .catch(() => caches.match(new URL('./index.html', self.registration.scope).href))
    );
    return;
  }

  // お知らせ(news.json)はネット優先 → 追加したらすぐ届く、オフライン時はキャッシュ
  if (url.origin === location.origin && url.pathname.endsWith('/news.json')) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
        .catch(() => caches.match(req, { cacheName: CACHE }))
    );
    return;
  }

  // それ以外（three.js・アイコン・Googleフォント）はキャッシュ優先
  if (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(
      caches.match(req, { cacheName: CACHE }).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
        return r;
      }))
    );
  }
});
