const CACHE_NAME = "first-words-v46";
const APP_ASSETS = [
  "./practice-fonts.css?v=20260920-1",
  "../../fonts/performance/taipei-moment-tc.ttf",
  "./destination-moment.js?v=20260920-1",
  "./learning-tools.js?v=20260920-5",
  "./learning-tools.css?v=20260920-5",
  "./directions-practice.js?v=20260920-1",
  "./exchange-practice.js?v=20260920-1",
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
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => /^(first-words-|hana-)/.test(key) && key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
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
    caches.match(event.request).then((cached) => {
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

