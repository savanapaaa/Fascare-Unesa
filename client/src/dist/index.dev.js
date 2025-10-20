"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initApp = void 0;

require("./styles/main.css");

require("./styles/responsive.css");

require("./styles/elemen.css");

require("./styles/swal.css");

require("./styles/admin.css");

var _swRegister = _interopRequireDefault(require("./utils/sw-register"));

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initApp = function initApp() {
  var loadingElement, app, appContainer;
  return regeneratorRuntime.async(function initApp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          loadingElement = document.getElementById('page-loading');
          _context.prev = 1;
          if (loadingElement) loadingElement.classList.remove('hidden');
          app = _App["default"].init();
          _context.next = 6;
          return regeneratorRuntime.awrap(app.renderPage());

        case 6:
          // ✅ DISABLED Service Worker untuk development debugging
          // Register Service Worker setelah app loaded
          // Gunakan setTimeout untuk memastikan DOM sudah ready
          // setTimeout(async () => {
          //   try {
          //     const registration = await swRegister();
          //     if (registration) {
          //       console.log('🎉 App siap dengan Service Worker!');
          //     }
          //   } catch (error) {
          //     console.error('❌ Gagal register Service Worker:', error);
          //   }
          // }, 100);
          if (loadingElement) loadingElement.classList.add('hidden');
          window.addEventListener('error', function (event) {
            console.error('Global error:', event.error);
            if (loadingElement) loadingElement.classList.add('hidden');
            var errorContainer = document.createElement('div');
            errorContainer.className = 'fixed inset-x-0 top-4 flex items-center justify-center z-50';
            errorContainer.innerHTML = "\n        <div class=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md\">\n          <strong class=\"font-bold\">Oops!</strong>\n          <span class=\"block sm:inline\"> Terjadi kesalahan. Silakan muat ulang halaman.</span>\n        </div>\n      ";
            document.body.appendChild(errorContainer);
            setTimeout(function () {
              errorContainer.remove();
            }, 5000);
          });
          _context.next = 16;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.error('Failed to initialize app:', _context.t0);
          appContainer = document.getElementById('app');

          if (appContainer) {
            appContainer.innerHTML = "\n        <div class=\"min-h-screen flex items-center justify-center\">\n          <div class=\"text-center\">\n            <h1 class=\"text-2xl font-bold text-gray-800 mb-4\">Oops! Terjadi Kesalahan</h1>\n            <p class=\"text-gray-600 mb-4\">Gagal memuat aplikasi. Silakan muat ulang halaman.</p>\n            <button onclick=\"window.location.reload()\" \n              class=\"px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors\">\n              Muat Ulang\n            </button>\n          </div>\n        </div>\n      ";
          }

          if (loadingElement) loadingElement.classList.add('hidden');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.initApp = initApp;
document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('popstate', function () {
  var app = _App["default"].init();

  app.renderPage();
});