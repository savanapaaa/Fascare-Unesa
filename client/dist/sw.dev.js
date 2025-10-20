"use strict";

var _workboxPrecaching = require("workbox-precaching");

var _workboxRouting = require("workbox-routing");

var _workboxStrategies = require("workbox-strategies");

var _workboxExpiration = require("workbox-expiration");

var _workboxCacheableResponse = require("workbox-cacheable-response");

var CACHE_NAMES = {
  "static": 'static-cache-v2',
  pages: 'pages-cache-v2',
  images: 'images-cache-v2',
  maps: 'maps-cache-v2'
};
(0, _workboxPrecaching.precacheAndRoute)(self.__WB_MANIFEST);
(0, _workboxPrecaching.cleanupOutdatedCaches)();

var navigationHandler = function navigationHandler(_ref) {
  var request, cache, response, cachedResponse, indexResponse;
  return regeneratorRuntime.async(function navigationHandler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = _ref.request;
          _context.next = 3;
          return regeneratorRuntime.awrap(caches.open(CACHE_NAMES.pages));

        case 3:
          cache = _context.sent;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch(request));

        case 7:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 12;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(cache.put(request, response.clone()));

        case 11:
          return _context.abrupt("return", response);

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](4);
          console.log('Offline mode, checking cache...');

        case 17:
          _context.prev = 17;
          _context.next = 20;
          return regeneratorRuntime.awrap(cache.match(request));

        case 20:
          cachedResponse = _context.sent;

          if (!cachedResponse) {
            _context.next = 23;
            break;
          }

          return _context.abrupt("return", cachedResponse);

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(cache.match('/index.html'));

        case 25:
          indexResponse = _context.sent;

          if (!indexResponse) {
            _context.next = 28;
            break;
          }

          return _context.abrupt("return", indexResponse);

        case 28:
          _context.next = 33;
          break;

        case 30:
          _context.prev = 30;
          _context.t1 = _context["catch"](17);
          console.log('Cache retrieval failed:', _context.t1);

        case 33:
          return _context.abrupt("return", new Response("<!DOCTYPE html>\n    <html lang=\"id\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>FasCare - Offline</title>\n        <style>\n            body {\n                font-family: system-ui, -apple-system, sans-serif;\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n                height: 100vh;\n                margin: 0;\n                padding: 20px;\n                text-align: center;\n                background-color: #f9fafb;\n            }\n            .container {\n                background: white;\n                padding: 2rem;\n                border-radius: 1rem;\n                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);\n                max-width: 400px;\n            }\n            h1 { color: #00899B; margin-bottom: 1rem; }\n            p { color: #4b5563; line-height: 1.5; }\n            button {\n                background: #00899B;\n                color: white;\n                border: none;\n                padding: 0.75rem 1.5rem;\n                border-radius: 0.5rem;\n                cursor: pointer;\n                margin-top: 1rem;\n            }\n            button:hover { background: #007a8c; }\n        </style>\n    </head>\n    <body>\n        <div class=\"container\">\n            <h1>FasCare</h1>\n            <p>Sepertinya Anda sedang offline. Mohon periksa koneksi internet Anda.</p>\n            <button onclick=\"window.location.reload()\">Coba Lagi</button>\n        </div>\n    </body>\n    </html>", {
            headers: {
              'Content-Type': 'text/html; charset=utf-8'
            }
          }));

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 14], [17, 30]]);
};

(0, _workboxRouting.registerRoute)(new _workboxRouting.NavigationRoute(navigationHandler));
(0, _workboxRouting.registerRoute)(function (_ref2) {
  var request = _ref2.request;
  return request.destination === 'script' || request.destination === 'style' || request.url.includes('.js') || request.url.includes('.css');
}, new _workboxStrategies.StaleWhileRevalidate({
  cacheName: CACHE_NAMES["static"],
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days

  })]
})); // Cache map tiles

(0, _workboxRouting.registerRoute)(function (_ref3) {
  var url = _ref3.url;
  return url.hostname.includes('tile.openstreetmap.org');
}, new _workboxStrategies.CacheFirst({
  cacheName: 'map-tiles',
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 1000,
    maxAgeSeconds: 30 * 24 * 60 * 60,
    // 30 days
    purgeOnQuotaError: true
  })]
})); // Cache Leaflet assets

(0, _workboxRouting.registerRoute)(function (_ref4) {
  var url = _ref4.url;
  return url.href.includes('leaflet');
}, new _workboxStrategies.CacheFirst({
  cacheName: 'leaflet-assets',
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 10,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days

  })]
})); // Cache geocoding requests

(0, _workboxRouting.registerRoute)(function (_ref5) {
  var url = _ref5.url;
  return url.hostname.includes('nominatim.openstreetmap.org');
}, new _workboxStrategies.NetworkFirst({
  cacheName: 'geocoding-cache',
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 100,
    maxAgeSeconds: 24 * 60 * 60 // 1 day

  })]
})); // Cache images

(0, _workboxRouting.registerRoute)(function (_ref6) {
  var request = _ref6.request;
  return request.destination === 'image';
}, new _workboxStrategies.CacheFirst({
  cacheName: CACHE_NAMES.images,
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60,
    // 30 days
    purgeOnQuotaError: true
  })]
})); // Cache API requests

(0, _workboxRouting.registerRoute)(function (_ref7) {
  var url = _ref7.url;
  return url.origin === 'https://urbanaid-server.up.railway.app';
}, new _workboxStrategies.NetworkFirst({
  cacheName: 'api-cache',
  plugins: [new _workboxCacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new _workboxExpiration.ExpirationPlugin({
    maxEntries: 100,
    maxAgeSeconds: 72 * 60 * 60 // 72 hours

  })]
})); // Install event

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(Promise.all([self.skipWaiting(), caches.open(CACHE_NAMES.pages).then(function (cache) {
    return cache.add('/index.html')["catch"](function (error) {
      console.error('Failed to cache index.html:', error);
    });
  })]));
}); // Activate event

self.addEventListener('activate', function (event) {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return !Object.values(CACHE_NAMES).includes(cacheName);
    }).map(function (cacheName) {
      console.log('[ServiceWorker] Removing old cache:', cacheName);
      return caches["delete"](cacheName);
    }));
  })]));
});