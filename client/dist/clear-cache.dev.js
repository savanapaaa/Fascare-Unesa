"use strict";

// Script untuk membersihkan cache browser
// Jalankan di Console Browser (F12)
function clearAllCaches() {
  var cacheNames, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cacheName, registrations, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, registration;

  return regeneratorRuntime.async(function clearAllCaches$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('🧹 Membersihkan semua cache...'); // 1. Clear Service Worker caches

          if (!('caches' in window)) {
            _context.next = 34;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(caches.keys());

        case 5:
          cacheNames = _context.sent;
          console.log('📦 Cache yang ditemukan:', cacheNames);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 10;
          _iterator = cacheNames[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 20;
            break;
          }

          cacheName = _step.value;
          _context.next = 16;
          return regeneratorRuntime.awrap(caches["delete"](cacheName));

        case 16:
          console.log("\u2705 Cache dihapus: ".concat(cacheName));

        case 17:
          _iteratorNormalCompletion = true;
          _context.next = 12;
          break;

        case 20:
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](10);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 26:
          _context.prev = 26;
          _context.prev = 27;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 29:
          _context.prev = 29;

          if (!_didIteratorError) {
            _context.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context.finish(29);

        case 33:
          return _context.finish(26);

        case 34:
          if (!('serviceWorker' in navigator)) {
            _context.next = 65;
            break;
          }

          _context.next = 37;
          return regeneratorRuntime.awrap(navigator.serviceWorker.getRegistrations());

        case 37:
          registrations = _context.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 41;
          _iterator2 = registrations[Symbol.iterator]();

        case 43:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 51;
            break;
          }

          registration = _step2.value;
          _context.next = 47;
          return regeneratorRuntime.awrap(registration.unregister());

        case 47:
          console.log('✅ Service Worker di-unregister');

        case 48:
          _iteratorNormalCompletion2 = true;
          _context.next = 43;
          break;

        case 51:
          _context.next = 57;
          break;

        case 53:
          _context.prev = 53;
          _context.t1 = _context["catch"](41);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 57:
          _context.prev = 57;
          _context.prev = 58;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 60:
          _context.prev = 60;

          if (!_didIteratorError2) {
            _context.next = 63;
            break;
          }

          throw _iteratorError2;

        case 63:
          return _context.finish(60);

        case 64:
          return _context.finish(57);

        case 65:
          // 3. Clear Local Storage
          if (localStorage) {
            localStorage.clear();
            console.log('✅ Local Storage dibersihkan');
          } // 4. Clear Session Storage


          if (sessionStorage) {
            sessionStorage.clear();
            console.log('✅ Session Storage dibersihkan');
          }

          console.log('🎉 Semua cache berhasil dibersihkan!');
          console.log('🔄 Silakan refresh halaman untuk melihat perubahan');
          _context.next = 74;
          break;

        case 71:
          _context.prev = 71;
          _context.t2 = _context["catch"](0);
          console.error('❌ Error saat membersihkan cache:', _context.t2);

        case 74:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 71], [10, 22, 26, 34], [27,, 29, 33], [41, 53, 57, 65], [58,, 60, 64]]);
} // Jalankan fungsi


clearAllCaches();