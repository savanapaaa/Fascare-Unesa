"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Image Handler untuk menangani loading gambar dengan fallback
 * Mencegah spam request dan menangani error dengan baik
 */
var ImageHandler =
/*#__PURE__*/
function () {
  function ImageHandler() {
    _classCallCheck(this, ImageHandler);

    this.loadedImages = new Map(); // Cache untuk gambar yang sudah berhasil dimuat

    this.failedImages = new Map(); // Map dengan timestamp untuk gambar yang gagal

    this.loadingImages = new Set(); // Set untuk gambar yang sedang dimuat

    this.placeholderUrl = '/images/placeholder.jpg'; // Default placeholder

    this.defaultPlaceholder = this.createDefaultPlaceholder();
    this.maxRetries = 1; // Batas maksimal retry (dikurangi untuk mencegah spam)

    this.retryDelay = 2000; // Delay antara retry (2 detik)

    this.failureExpiry = 10 * 60 * 1000; // 10 menit sebelum boleh retry lagi

    this.placeholderTested = false; // Flag untuk cek apakah placeholder.jpg tersedia

    this.placeholderAvailable = false; // Flag status placeholder.jpg
  }
  /**
   * Buat placeholder SVG default yang selalu tersedia
   */


  _createClass(ImageHandler, [{
    key: "createDefaultPlaceholder",
    value: function createDefaultPlaceholder() {
      var svg = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"300\" viewBox=\"0 0 400 300\">\n        <rect width=\"400\" height=\"300\" fill=\"#f3f4f6\"/>\n        <rect x=\"20\" y=\"20\" width=\"360\" height=\"260\" fill=\"none\" stroke=\"#d1d5db\" stroke-width=\"2\" stroke-dasharray=\"5,5\" rx=\"8\"/>\n        <circle cx=\"200\" cy=\"120\" r=\"25\" fill=\"#9ca3af\"/>\n        <path d=\"M185 120 L200 105 L215 120 Z\" fill=\"#6b7280\"/>\n        <text x=\"200\" y=\"180\" text-anchor=\"middle\" fill=\"#6b7280\" font-family=\"Arial, sans-serif\" font-size=\"16\" font-weight=\"500\">\n          Tidak Ada Gambar\n        </text>\n        <text x=\"200\" y=\"205\" text-anchor=\"middle\" fill=\"#9ca3af\" font-family=\"Arial, sans-serif\" font-size=\"12\">\n          Gambar tidak tersedia\n        </text>\n      </svg>\n    ";
      return "data:image/svg+xml;base64,".concat(btoa(svg));
    }
    /**
     * Test apakah placeholder.jpg tersedia di server
     */

  }, {
    key: "testPlaceholderAvailability",
    value: function testPlaceholderAvailability() {
      var response;
      return regeneratorRuntime.async(function testPlaceholderAvailability$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.placeholderTested) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", this.placeholderAvailable);

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return regeneratorRuntime.awrap(fetch(this.placeholderUrl, {
                method: 'HEAD',
                cache: 'no-cache'
              }));

            case 5:
              response = _context.sent;
              this.placeholderAvailable = response.ok;
              this.placeholderTested = true;
              console.log("\uD83D\uDCF7 Placeholder test: ".concat(this.placeholderUrl, " ").concat(this.placeholderAvailable ? '✅ Available' : '❌ Not found'));
              return _context.abrupt("return", this.placeholderAvailable);

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);
              this.placeholderAvailable = false;
              this.placeholderTested = true;
              console.log("\uD83D\uDCF7 Placeholder test failed: ".concat(_context.t0.message));
              return _context.abrupt("return", false);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[2, 12]]);
    }
    /**
     * Cek apakah gambar masih dalam periode gagal
     */

  }, {
    key: "isImageRecentlyFailed",
    value: function isImageRecentlyFailed(imageUrl) {
      var failTime = this.failedImages.get(imageUrl);
      if (!failTime) return false;
      var now = Date.now();
      var timeSinceFailure = now - failTime; // Jika sudah lewat periode expiry, hapus dari failed list

      if (timeSinceFailure > this.failureExpiry) {
        this.failedImages["delete"](imageUrl);
        return false;
      }

      return true;
    }
    /**
     * Cek apakah gambar sedang dalam proses loading
     */

  }, {
    key: "isImageLoading",
    value: function isImageLoading(imageUrl) {
      return this.loadingImages.has(imageUrl);
    }
    /**
     * Load gambar dengan fallback handling
     * @param {HTMLImageElement} imgElement - Element img yang akan diload
     * @param {string|null} imageUrl - URL gambar dari API
     * @param {Object} options - Opsi tambahan
     */

  }, {
    key: "loadImage",
    value: function loadImage(imgElement, imageUrl) {
      var _this = this;

      var options,
          _options$showStatus,
          showStatus,
          _options$statusElemen,
          statusElement,
          _options$onLoading,
          onLoading,
          _options$onSuccess,
          onSuccess,
          _options$onError,
          onError,
          _options$retryCount,
          retryCount,
          loadedImageUrl,
          _args2 = arguments;

      return regeneratorRuntime.async(function loadImage$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              _options$showStatus = options.showStatus, showStatus = _options$showStatus === void 0 ? false : _options$showStatus, _options$statusElemen = options.statusElement, statusElement = _options$statusElemen === void 0 ? null : _options$statusElemen, _options$onLoading = options.onLoading, onLoading = _options$onLoading === void 0 ? null : _options$onLoading, _options$onSuccess = options.onSuccess, onSuccess = _options$onSuccess === void 0 ? null : _options$onSuccess, _options$onError = options.onError, onError = _options$onError === void 0 ? null : _options$onError, _options$retryCount = options.retryCount, retryCount = _options$retryCount === void 0 ? 0 : _options$retryCount; // Reset classes

              imgElement.classList.remove('loading', 'error'); // Jika URL kosong/null, langsung pakai placeholder

              if (!(!imageUrl || imageUrl.trim() === '')) {
                _context2.next = 7;
                break;
              }

              console.log('📷 No image URL provided, using placeholder');
              this.setPlaceholderSafely(imgElement, statusElement, 'Tidak ada gambar');
              return _context2.abrupt("return");

            case 7:
              if (!this.isImageLoading(imageUrl)) {
                _context2.next = 10;
                break;
              }

              console.log('📷 Image already loading, skipping:', imageUrl);
              return _context2.abrupt("return");

            case 10:
              if (!this.isImageRecentlyFailed(imageUrl)) {
                _context2.next = 14;
                break;
              }

              console.log('📷 Image recently failed, using placeholder:', imageUrl);
              this.setPlaceholderSafely(imgElement, statusElement, 'Gambar tidak tersedia');
              return _context2.abrupt("return");

            case 14:
              if (!this.loadedImages.has(imageUrl)) {
                _context2.next = 20;
                break;
              }

              console.log('📷 Using cached image:', imageUrl);
              imgElement.src = this.loadedImages.get(imageUrl);
              this.updateStatus(statusElement, 'Dimuat dari cache', 'status-success');
              onSuccess && onSuccess(imgElement);
              return _context2.abrupt("return");

            case 20:
              // Tandai sebagai sedang loading
              this.loadingImages.add(imageUrl); // Mulai loading

              imgElement.classList.add('loading');
              this.updateStatus(statusElement, 'Memuat...', 'status-loading');
              onLoading && onLoading(imgElement);
              _context2.prev = 24;
              _context2.next = 27;
              return regeneratorRuntime.awrap(this.loadImageAsync(imageUrl));

            case 27:
              loadedImageUrl = _context2.sent;
              // Remove dari loading set
              this.loadingImages["delete"](imageUrl); // Sukses loading

              imgElement.classList.remove('loading');
              imgElement.src = loadedImageUrl;
              this.loadedImages.set(imageUrl, loadedImageUrl); // Remove dari failed images jika ada

              this.failedImages["delete"](imageUrl);
              this.updateStatus(statusElement, 'Gambar dimuat', 'status-success');
              onSuccess && onSuccess(imgElement);
              console.log('✅ Image loaded successfully:', imageUrl);
              _context2.next = 51;
              break;

            case 38:
              _context2.prev = 38;
              _context2.t0 = _context2["catch"](24);
              // Remove dari loading set
              this.loadingImages["delete"](imageUrl);
              console.warn('❌ Failed to load image:', imageUrl, _context2.t0.message); // Retry dengan backoff jika belum mencapai max retry

              if (!(retryCount < this.maxRetries)) {
                _context2.next = 46;
                break;
              }

              console.log("\uD83D\uDD04 Retrying image load (".concat(retryCount + 1, "/").concat(this.maxRetries, "):"), imageUrl);
              setTimeout(function () {
                _this.loadImage(imgElement, imageUrl, _objectSpread({}, options, {
                  retryCount: retryCount + 1
                }));
              }, this.retryDelay * (retryCount + 1)); // Exponential backoff

              return _context2.abrupt("return");

            case 46:
              // Simpan waktu gagal dengan timestamp
              this.failedImages.set(imageUrl, Date.now());
              imgElement.classList.remove('loading');
              imgElement.classList.add('error'); // Fallback ke placeholder

              this.setPlaceholderSafely(imgElement, statusElement, 'Gagal memuat gambar');
              onError && onError(imgElement, _context2.t0);

            case 51:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[24, 38]]);
    }
    /**
     * Load gambar secara async dengan Promise
     */

  }, {
    key: "loadImageAsync",
    value: function loadImageAsync(url) {
      return new Promise(function (resolve, reject) {
        var testImg = new Image();

        testImg.onload = function () {
          resolve(url);
        };

        testImg.onerror = function () {
          reject(new Error("Failed to load image: ".concat(url)));
        }; // Set timeout untuk mencegah hanging request


        setTimeout(function () {
          reject(new Error("Image load timeout: ".concat(url)));
        }, 10000); // 10 detik timeout

        testImg.src = url;
      });
    }
    /**
     * Set placeholder image dengan perlindungan dari infinite loop
     */

  }, {
    key: "setPlaceholderSafely",
    value: function setPlaceholderSafely(imgElement, statusElement, statusText) {
      var _this2 = this;

      var placeholderAvailable;
      return regeneratorRuntime.async(function setPlaceholderSafely$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(this.testPlaceholderAvailability());

            case 3:
              placeholderAvailable = _context3.sent;

              if (placeholderAvailable) {
                console.log('📷 Using server placeholder.jpg');
                imgElement.src = this.placeholderUrl;

                imgElement.onerror = function () {
                  // Fallback jika placeholder.jpg gagal load
                  console.log('📷 Server placeholder failed, using SVG fallback');
                  imgElement.src = _this2.defaultPlaceholder;
                  imgElement.onerror = null; // Prevent infinite loop
                };
              } else {
                console.log('📷 Using safe SVG placeholder');
                imgElement.src = this.defaultPlaceholder;
              }

              this.updateStatus(statusElement, statusText, 'status-placeholder');
              _context3.next = 13;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](0);
              console.log('📷 Error in setPlaceholderSafely, using SVG fallback:', _context3.t0.message);
              imgElement.src = this.defaultPlaceholder;
              this.updateStatus(statusElement, statusText, 'status-placeholder');

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 8]]);
    }
    /**
     * Set placeholder image (legacy - kept for compatibility)
     */

  }, {
    key: "setPlaceholder",
    value: function setPlaceholder(imgElement, statusElement, statusText) {
      return regeneratorRuntime.async(function setPlaceholder$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.setPlaceholderSafely(imgElement, statusElement, statusText));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
    /**
     * Update status indicator
     */

  }, {
    key: "updateStatus",
    value: function updateStatus(statusElement, text, className) {
      if (statusElement) {
        statusElement.textContent = text;
        statusElement.className = "image-status ".concat(className);
        statusElement.style.display = text ? 'block' : 'none';
      }
    }
    /**
     * Clear cache (untuk development/debugging)
     */

  }, {
    key: "clearCache",
    value: function clearCache() {
      this.loadedImages.clear();
      this.failedImages.clear();
      this.loadingImages.clear();
      console.log('🧹 Image cache cleared completely');
    }
    /**
     * Retry loading failed image
     */

  }, {
    key: "retryImage",
    value: function retryImage(imgElement, imageUrl) {
      var options,
          _args5 = arguments;
      return regeneratorRuntime.async(function retryImage$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
              this.failedImages["delete"](imageUrl);
              this.loadingImages["delete"](imageUrl);
              _context5.next = 5;
              return regeneratorRuntime.awrap(this.loadImage(imgElement, imageUrl, _objectSpread({}, options, {
                retryCount: 0
              })));

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
    /**
     * Mendapatkan statistik cache untuk debugging
     */

  }, {
    key: "getCacheStats",
    value: function getCacheStats() {
      return {
        loadedImages: this.loadedImages.size,
        failedImages: this.failedImages.size,
        loadingImages: this.loadingImages.size,
        failedList: Array.from(this.failedImages.keys())
      };
    }
  }]);

  return ImageHandler;
}(); // Global instance


window.imageHandler = new ImageHandler(); // Auto-load images dengan perlindungan dari multiple execution

var isAutoLoadExecuted = false;
document.addEventListener('DOMContentLoaded', function () {
  if (isAutoLoadExecuted) {
    console.log('📷 Auto-load already executed, skipping');
    return;
  }

  isAutoLoadExecuted = true;
  console.log('📷 Starting auto-load images');
  var images = document.querySelectorAll('img[data-src]');
  console.log("\uD83D\uDCF7 Found ".concat(images.length, " images to auto-load"));
  images.forEach(function (img, index) {
    var imageUrl = img.dataset.src;
    var statusElement = document.querySelector("#".concat(img.id, "Status")); // Tambahkan delay kecil antara loading gambar untuk mencegah race condition

    setTimeout(function () {
      window.imageHandler.loadImage(img, imageUrl, {
        showStatus: true,
        statusElement: statusElement
      });
    }, index * 50); // 50ms delay antara setiap gambar
  });
});