"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Report Detail Page Handler
 * Menangani loading dan display detail laporan
 */
var ReportDetailPage =
/*#__PURE__*/
function () {
  function ReportDetailPage() {
    _classCallCheck(this, ReportDetailPage);

    this.reportId = this.getReportIdFromUrl();
    this.apiBaseUrl = 'http://localhost:3001/api'; // Sesuaikan dengan backend

    this.init();
  }
  /**
   * Extract report ID dari URL
   */


  _createClass(ReportDetailPage, [{
    key: "getReportIdFromUrl",
    value: function getReportIdFromUrl() {
      var urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id') || window.location.pathname.split('/').pop();
    }
    /**
     * Initialize page
     */

  }, {
    key: "init",
    value: function init() {
      var reportData;
      return regeneratorRuntime.async(function init$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(this.fetchReportDetail(this.reportId));

            case 3:
              reportData = _context.sent;
              this.displayReportDetail(reportData);
              _context.next = 11;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error('❌ Error loading report:', _context.t0);
              this.showError('Gagal memuat detail laporan');

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
    /**
     * Fetch report detail dari API
     */

  }, {
    key: "fetchReportDetail",
    value: function fetchReportDetail(reportId) {
      var response, data;
      return regeneratorRuntime.async(function fetchReportDetail$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(fetch("".concat(this.apiBaseUrl, "/reports/").concat(reportId), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json' // Add auth header jika diperlukan
                  // 'Authorization': `Bearer ${localStorage.getItem('token')}`

                }
              }));

            case 3:
              response = _context2.sent;

              if (response.ok) {
                _context2.next = 6;
                break;
              }

              throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));

            case 6:
              _context2.next = 8;
              return regeneratorRuntime.awrap(response.json());

            case 8:
              data = _context2.sent;
              return _context2.abrupt("return", data.data || data);

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              console.error('❌ API Error:', _context2.t0);
              throw _context2.t0;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
    /**
     * Display report detail di UI
     */

  }, {
    key: "displayReportDetail",
    value: function displayReportDetail(reportData) {
      // Update basic info
      document.getElementById('reportId').textContent = reportData.id || this.reportId;
      document.getElementById('reportTitle').textContent = reportData.judul || 'Tidak ada judul';
      document.getElementById('reportDescription').textContent = reportData.deskripsi || 'Tidak ada deskripsi'; // Handle image loading

      this.loadReportImage(reportData);
    }
    /**
     * Load report image dengan proper fallback
     */

  }, {
    key: "loadReportImage",
    value: function loadReportImage(reportData) {
      var _this = this;

      var imgElement = document.getElementById('reportImage');
      var statusElement = document.getElementById('imageStatus'); // Tentukan URL gambar

      var imageUrl = null; // Cek berbagai kemungkinan field nama untuk gambar

      if (reportData.url_gambar) {
        imageUrl = reportData.url_gambar;
      } else if (reportData.image_url) {
        imageUrl = reportData.image_url;
      } else if (reportData.gambar) {
        imageUrl = reportData.gambar;
      } else if (reportData.foto) {
        imageUrl = reportData.foto;
      } // Jika URL relatif, buat absolute URL


      if (imageUrl && !imageUrl.startsWith('http')) {
        // Untuk development: http://localhost:3001
        // Untuk production: sesuaikan dengan domain backend
        imageUrl = "".concat(this.apiBaseUrl.replace('/api', '')).concat(imageUrl);
      }

      console.log('📷 Loading report image:', imageUrl || 'No image URL'); // Load image menggunakan ImageHandler

      window.imageHandler.loadImage(imgElement, imageUrl, {
        showStatus: true,
        statusElement: statusElement,
        onLoading: function onLoading(img) {
          console.log('📷 Starting to load image...');
        },
        onSuccess: function onSuccess(img) {
          console.log('✅ Report image loaded successfully'); // Hide status setelah 3 detik jika sukses

          setTimeout(function () {
            if (statusElement) statusElement.style.display = 'none';
          }, 3000);
        },
        onError: function onError(img, error) {
          console.warn('❌ Report image failed to load:', error.message); // Bisa add analytics/logging untuk track image failures

          _this.trackImageError(imageUrl, error);
        }
      });
    }
    /**
     * Track image loading errors untuk analytics
     */

  }, {
    key: "trackImageError",
    value: function trackImageError(imageUrl, error) {
      // Send ke analytics service jika ada
      console.log('📊 Tracking image error:', {
        reportId: this.reportId,
        imageUrl: imageUrl,
        error: error.message,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
    /**
     * Show error message
     */

  }, {
    key: "showError",
    value: function showError(message) {
      var container = document.querySelector('.report-container');
      container.innerHTML = "\n      <div style=\"text-align: center; padding: 40px;\">\n        <h2 style=\"color: #ef4444;\">\u26A0\uFE0F Error</h2>\n        <p>".concat(message, "</p>\n        <button onclick=\"window.location.reload()\" style=\"\n          background: #3b82f6; \n          color: white; \n          padding: 8px 16px; \n          border: none; \n          border-radius: 4px; \n          cursor: pointer;\n        \">\n          Coba Lagi\n        </button>\n      </div>\n    ");
    }
    /**
     * Retry loading image
     */

  }, {
    key: "retryImage",
    value: function retryImage() {
      var imgElement = document.getElementById('reportImage');
      var currentSrc = imgElement.src;

      if (currentSrc && currentSrc !== window.imageHandler.defaultPlaceholder) {
        window.imageHandler.retryImage(imgElement, currentSrc, {
          showStatus: true,
          statusElement: document.getElementById('imageStatus')
        });
      }
    }
  }]);

  return ReportDetailPage;
}(); // Initialize when DOM is ready


document.addEventListener('DOMContentLoaded', function () {
  window.reportDetailPage = new ReportDetailPage();
}); // Add retry button functionality

document.addEventListener('click', function (e) {
  if (e.target.matches('.retry-image-btn')) {
    window.reportDetailPage.retryImage();
  }
});