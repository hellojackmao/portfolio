const CACHE_NAME = "first-words-v53";
const APP_ASSETS = [
  "../../fonts/first-words/offline/noto-serif-tc-booking.woff2",
  "../../fonts/first-words/offline/pronunciation-400.woff2",
  "./offline-fonts.css?v=20260920-1",
  "../../fonts/first-words/offline/gowun-dodum.woff2",
  "../../fonts/first-words/offline/gowun-batang-400.woff2",
  "../../fonts/first-words/offline/gowun-batang-700.woff2",
  "../../fonts/first-words/offline/shippori-400.woff2",
  "../../fonts/first-words/offline/shippori-500.woff2",
  "../../fonts/first-words/offline/shippori-600.woff2",
  "../../fonts/first-words/offline/shippori-700.woff2",
  "../../fonts/first-words/offline/manrope-400.woff2",
  "../../fonts/first-words/offline/manrope-600.woff2",
  "../../fonts/first-words/offline/manrope-700.woff2",
  "../../fonts/first-words/offline/manrope-800.woff2",
  "../../fonts/first-words/offline/fraunces-500.woff2",
  "../../fonts/first-words/offline/fraunces-600.woff2",
  "../../fonts/first-words/offline/fraunces-700.woff2",
  "../../fonts/first-words/offline/noto-serif-tc-400.woff2",
  "../../fonts/first-words/offline/noto-serif-tc-500.woff2",
  "../../fonts/first-words/offline/noto-serif-tc-600.woff2",
  "../../fonts/first-words/offline/noto-serif-tc-700.woff2",

  "./practice-backup.js?v=20260920-1",
  "../../fonts/performance/hongkong-moment.ttf",
  "../../fonts/performance/seoul-moment.ttf",
  "../../fonts/performance/tokyo-moment.ttf",

  "./practice-fonts.css?v=20260920-2",
  "../../fonts/performance/taipei-moment-tc.ttf",
  "./destination-moment.js?v=20260925-language",
  "./learning-tools.js?v=20260920-7",
  "./learning-tools.css?v=20260920-7",
  "./directions-practice.js?v=20260920-1",
  "./exchange-practice.js?v=20260925-language",
  "../../fonts/performance/kana-reference.ttf",
  "../../fonts/performance/hangul-reference.ttf",
  "./",
  "./index.html",
  "./learning-return.js",
  "./learning-return.js?v=20260919-2",
  "./language-entry.css",
  "./language-entry.css?v=20260919-1",
  "./directions-practice.css",
  "./directions-practice.js",
  "./directions-practice.js?v=20260919-2",
  "./exchange-practice.css",
  "./exchange-practice.js",
  "./hub-fonts.css",
  "./practice-fonts.css",
  "./japanese-fonts.css",
  "../../fonts/performance/japanese-0.woff2",
  "../../fonts/performance/japanese-1.woff2",
  "../../fonts/performance/japanese-2.woff2",
  "../../fonts/performance/japanese-3.woff2",
  "../../fonts/performance/japanese-4.woff2",
  "../../fonts/performance/practice-0.woff2",
  "../../fonts/performance/practice-1.woff2",
  "../../fonts/performance/practice-2.woff2",
  "../../fonts/performance/practice-3.woff2",
  "../../fonts/performance/practice-4.woff2",
  "../../fonts/first-words/manrope-hub-0.woff2",
  "../../fonts/first-words/shippori-hub-0.woff2",
  "../../fonts/first-words/shippori-hub-1.woff2",
  "../../fonts/first-words/shippori-hub-2.woff2",
  "./korean.html",
  "./japanese.html",
  "./chinese.html",
  "./practice.html",
  "./traditional-mandarin.html",
  "./cantonese.html",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/favicon.svg",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-192.svg",
  "./icons/icon-512.png",
  "./icons/icon-512.svg",
  "./icons/apple-touch-icon.png",
  "./icons/apple-touch-icon.svg",
  "./icons/maskable.svg",
  "./icons/og-image.png",
  "./icons/og-image.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS.map(url => new Request(url, { cache: "reload" })))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => /^(first-words-|hana-)/.test(key) && key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          // Destination queries select client-side content in the same cached page.
          return (await cache.match(event.request)) ||
            (await cache.match(event.request, { ignoreSearch: true })) ||
            cache.match("./index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => cache.match(event.request)).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok || response.type === "opaque") caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => Response.error());
    })
  );
});

