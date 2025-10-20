"use strict";

// ✅ CONTOH DEBUGGING DAN TESTING UNTUK MASALAH INFINITE LOOP
// 1. Function untuk monitor request ke server
function monitorImageRequests() {
  var originalFetch = window.fetch;
  var requestLog = [];

  window.fetch = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var url = args[0];
    var timestamp = new Date().toISOString(); // Log jika request ke gambar

    if (url && typeof url === 'string' && url.includes('.jpg')) {
      requestLog.push({
        url: url,
        timestamp: timestamp,
        stackTrace: new Error().stack
      });
      console.warn("\uD83D\uDEA8 Image request detected: ".concat(url, " at ").concat(timestamp)); // Alert jika ada request spam (lebih dari 5 dalam 1 detik)

      var recentRequests = requestLog.filter(function (req) {
        return req.url === url && Date.now() - new Date(req.timestamp).getTime() < 1000;
      });

      if (recentRequests.length > 5) {
        console.error('🚨 SPAM REQUEST DETECTED!', {
          url: url,
          count: recentRequests.length,
          recent: recentRequests
        }); // Tampilkan alert

        alert("SPAM REQUEST DETECTED!\nURL: ".concat(url, "\nCount: ").concat(recentRequests.length, " requests in 1 second"));
      }
    }

    return originalFetch.apply(this, args);
  }; // Function untuk melihat log


  window.getImageRequestLog = function () {
    return requestLog;
  };

  window.clearImageRequestLog = function () {
    return requestLog.length = 0;
  };
} // 2. Function untuk debugging image handler


function debugImageHandler() {
  if (!window.imageHandler) {
    console.error('ImageHandler not found!');
    return;
  }

  console.log('🔍 ImageHandler Debug Info:');
  console.log('Cache Stats:', window.imageHandler.getCacheStats()); // Override console.log untuk track calls

  var originalLog = console.log;
  var imageHandlerCalls = 0;

  console.log = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var message = args.join(' ');

    if (message.includes('📷')) {
      imageHandlerCalls++;

      if (imageHandlerCalls > 50) {
        console.error('🚨 Too many image handler calls! Possible infinite loop!');
        debugger; // Break di debugger
      }
    }

    return originalLog.apply(this, args);
  };
} // 3. Function untuk test manual


function testImageLoading() {
  console.log('🧪 Testing image loading...'); // Create test image element

  var testImg = document.createElement('img');
  testImg.id = 'test-image';
  testImg.style.display = 'none';
  document.body.appendChild(testImg); // Test dengan URL yang tidak ada

  console.log('Testing with non-existent URL...');
  window.imageHandler.loadImage(testImg, '/images/does-not-exist.jpg', {
    onLoading: function onLoading() {
      return console.log('Loading started');
    },
    onSuccess: function onSuccess() {
      return console.log('Loading success');
    },
    onError: function onError(img, error) {
      return console.log('Loading error:', error.message);
    }
  }); // Test dengan placeholder.jpg

  setTimeout(function () {
    console.log('Testing with placeholder.jpg...');
    window.imageHandler.loadImage(testImg, '/images/placeholder.jpg', {
      onLoading: function onLoading() {
        return console.log('Placeholder loading started');
      },
      onSuccess: function onSuccess() {
        return console.log('Placeholder loading success');
      },
      onError: function onError(img, error) {
        return console.log('Placeholder loading error:', error.message);
      }
    });
  }, 2000); // Cleanup

  setTimeout(function () {
    document.body.removeChild(testImg);
    console.log('Test completed and cleaned up');
  }, 5000);
} // 4. Function untuk disable semua auto-reload


function disableAllAutoReload() {
  console.log('🛑 Disabling all auto-reload mechanisms...'); // Disable setInterval yang mungkin ada

  var originalSetInterval = window.setInterval;

  window.setInterval = function (callback, delay) {
    console.warn('setInterval blocked:', callback.toString().substring(0, 100));
    return null; // Don't actually set the interval
  }; // Disable setTimeout yang mencurigakan


  var originalSetTimeout = window.setTimeout;

  window.setTimeout = function (callback, delay) {
    var callbackString = callback.toString();

    if (callbackString.includes('reload') || callbackString.includes('refresh') || callbackString.includes('location')) {
      console.warn('Suspicious setTimeout blocked:', callbackString.substring(0, 100));
      return null;
    }

    return originalSetTimeout.apply(this, arguments);
  }; // Disable event listeners yang mencurigakan


  var originalAddEventListener = document.addEventListener;

  document.addEventListener = function (event, handler, options) {
    if (event === 'beforeunload' || event === 'unload') {
      console.warn('Unload event listener blocked');
      return;
    }

    return originalAddEventListener.apply(this, arguments);
  };

  console.log('✅ Auto-reload mechanisms disabled');
} // 5. Function untuk check file placeholder.jpg exists


function checkPlaceholderExists() {
  var response;
  return regeneratorRuntime.async(function checkPlaceholderExists$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('🔍 Checking if placeholder.jpg exists...');
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch('/images/placeholder.jpg', {
            method: 'HEAD',
            cache: 'no-cache'
          }));

        case 4:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 10;
            break;
          }

          console.log('✅ placeholder.jpg exists');
          return _context.abrupt("return", true);

        case 10:
          console.log('❌ placeholder.jpg not found (HTTP ' + response.status + ')');
          return _context.abrupt("return", false);

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          console.log('❌ Error checking placeholder.jpg:', _context.t0.message);
          return _context.abrupt("return", false);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 14]]);
} // 6. Function untuk run all debugging


function runFullDebug() {
  var placeholderExists;
  return regeneratorRuntime.async(function runFullDebug$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('🚀 Starting full debug session...');
          monitorImageRequests();
          debugImageHandler();
          _context2.next = 5;
          return regeneratorRuntime.awrap(checkPlaceholderExists());

        case 5:
          placeholderExists = _context2.sent;

          if (!placeholderExists) {
            console.warn('⚠️ placeholder.jpg not found - this might be causing the spam requests!');
          }

          console.log('🎯 Debug session started. Run these commands:');
          console.log('- testImageLoading() - Test image loading');
          console.log('- disableAllAutoReload() - Disable auto-reload');
          console.log('- getImageRequestLog() - View request log');
          console.log('- window.imageHandler.getCacheStats() - View cache stats');
          console.log('- window.imageHandler.clearCache() - Clear cache');

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Auto-run debug jika di development


if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode detected, auto-running debug...');
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(runFullDebug, 1000);
  });
} // Export functions ke global scope


window.monitorImageRequests = monitorImageRequests;
window.debugImageHandler = debugImageHandler;
window.testImageLoading = testImageLoading;
window.disableAllAutoReload = disableAllAutoReload;
window.checkPlaceholderExists = checkPlaceholderExists;
window.runFullDebug = runFullDebug;