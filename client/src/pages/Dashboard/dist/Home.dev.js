"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Navbar = require("../../components/common/Navbar.js");

var _Footer = require("../../components/common/Footer.js");

var _statisticService = _interopRequireDefault(require("../../services/statistic-service.js"));

var _countup = require("countup.js");

var _Loading = _interopRequireDefault(require("../../components/common/Loading.js"));

var _SkeletonLoading = _interopRequireDefault(require("../../components/common/SkeletonLoading.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var HomePage = {
  stats: {
    total: 0,
    completed: 0,
    pending: 0
  },
  testimonials: [],
  scrollToTop: function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  },
  init: function init() {
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _Loading["default"].show();

            this.renderWithSkeleton();
            this.scrollToTop();
            _context.next = 6;
            return regeneratorRuntime.awrap(Promise.all([this.loadSvgSprites(), this.loadData()]));

          case 6:
            this.render();
            this.attachEventListeners();
            this.initCounterAnimation();
            AOS.init({
              duration: 500,
              once: true,
              offset: 100
            });
            this.initTilt();
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            console.error('Error initializing home page:', _context.t0);

          case 16:
            _context.prev = 16;

            _Loading["default"].hide();

            return _context.finish(16);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, null, this, [[0, 13, 16, 19]]);
  },
  renderWithSkeleton: function renderWithSkeleton() {
    var content = "\n            ".concat((0, _Navbar.Navbar)(), "\n            <main class=\"min-h-screen\">\n            <section class=\"hero-section relative overflow-hidden\">\n                ").concat(_SkeletonLoading["default"].heroSkeleton(), "\n            </section>\n                            <section class=\"bg-white py-12 md:py-16 lg:py-20\">\n                    ").concat(_SkeletonLoading["default"].articleSkeleton(), "\n                </section>\n                <section class=\"py-12 md:py-16 lg:py-20\">\n                    ").concat(_SkeletonLoading["default"].articleSkeleton(), "\n                </section>\n                <section class=\"stats-section py-16 md:py-20\">\n                    <div class=\"container mx-auto px-4\">\n                        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8\">\n                            ").concat(Array(3).fill(_SkeletonLoading["default"].profileSkeleton()).join(''), "\n                        </div>\n                    </div>\n                </section>\n                ").concat(this.createProcessSection(), "\n                <section class=\"bg-gray-50 py-16 md:py-20\">\n                    <div class=\"container mx-auto px-4\">\n                        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8\">\n                            ").concat(Array(3).fill(_SkeletonLoading["default"].reportSkeleton()).join(''), "\n                        </div>\n                    </div>\n                </section>\n            </main>\n            ").concat((0, _Footer.Footer)(), "\n        ");
    var appContainer = document.getElementById('app');

    if (appContainer) {
      appContainer.innerHTML = content;
    }
  },
  initTilt: function initTilt() {
    var _this = this;

    var isMobile = window.innerWidth < 768;
    var tiltInstances = [];

    var initTiltElement = function initTiltElement(elements, options) {
      if (!isMobile && elements.length > 0) {
        var instances = VanillaTilt.init(elements, options);
        tiltInstances = [].concat(_toConsumableArray(tiltInstances), _toConsumableArray(Array.isArray(instances) ? instances : [instances]));
      }
    };

    initTiltElement(document.querySelectorAll('.stats-card.tilt-card'), {
      max: 15,
      speed: 400,
      scale: 1.05,
      glare: true,
      'max-glare': 0.3,
      perspective: 800,
      transition: true,
      'full-page-listening': true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
    var heroImage = document.querySelector('.hero-section .tilt-card');

    if (heroImage) {
      initTiltElement([heroImage], {
        max: 10,
        speed: 1000,
        scale: 1.03,
        glare: true,
        'max-glare': 0.5,
        perspective: 1000,
        transition: true,
        gyroscope: false,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
      });
    }

    initTiltElement(document.querySelectorAll('.process-steps-desktop .tilt-card'), {
      max: 20,
      speed: 200,
      scale: 1.05,
      glare: true,
      'max-glare': 0.3,
      perspective: 1000,
      transition: true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
    initTiltElement(document.querySelectorAll('.testimonial-card.tilt-card'), {
      max: 15,
      speed: 300,
      scale: 1.03,
      glare: true,
      'max-glare': 0.4,
      perspective: 1000,
      transition: true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
    var infraCard = document.querySelector('.infrastructure-card.tilt-card');

    if (infraCard) {
      initTiltElement([infraCard], {
        max: 8,
        speed: 800,
        scale: 1.02,
        glare: true,
        'max-glare': 0.3,
        perspective: 2000,
        transition: true,
        gyroscope: false,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
      });
    }

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        var newIsMobile = window.innerWidth < 768;

        if (newIsMobile !== isMobile) {
          tiltInstances.forEach(function (instance) {
            if (instance && instance.destroy) {
              instance.destroy();
            }
          });
          tiltInstances = [];

          if (!newIsMobile) {
            _this.initTilt();
          }
        }
      }, 250);
    });
  },
  loadData: function loadData() {
    var statsResponse, reviewsResponse;
    return regeneratorRuntime.async(function loadData$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(_statisticService["default"].getReportStatistics());

          case 3:
            statsResponse = _context2.sent;

            if (statsResponse.status === 'success') {
              this.stats = statsResponse.data;
            }

            _context2.next = 7;
            return regeneratorRuntime.awrap(_statisticService["default"].getReviews());

          case 7:
            reviewsResponse = _context2.sent;

            if (reviewsResponse.status === 'success') {
              this.testimonials = reviewsResponse.data.map(function (review) {
                return {
                  name: review.user_name,
                  rating: review.rating,
                  text: review.review_text
                };
              });
            }

            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            console.error('Error loading data:', _context2.t0);
            throw _context2.t0;

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this, [[0, 11]]);
  },
  loadSvgSprites: function loadSvgSprites() {
    var svgUrl = '/images/decorative-elements.svg';
    fetch(svgUrl).then(function (response) {
      return response.text();
    }).then(function (svgContent) {
      var div = document.createElement('div');
      div.style.display = 'none';
      div.innerHTML = svgContent;
      document.body.appendChild(div);
    })["catch"](function (error) {
      return console.error('Error loading SVG sprites:', error);
    });
  },
  render: function render() {
    var content = "\n            ".concat((0, _Navbar.Navbar)(), "\n            <main class=\"min-h-screen\">\n                ").concat(this.createHeroSection(), "\n                ").concat(this.createIntroSection(), "\n                ").concat(this.createInfrastructureSection(), "\n                ").concat(this.createStatsSection(), "\n                ").concat(this.createProcessSection(), "\n                ").concat(this.createTestimonialsSection(), "\n            </main>\n            ").concat((0, _Footer.Footer)(), "\n        ");
    var appContainer = document.getElementById('app');

    if (appContainer) {
      appContainer.innerHTML = content;
    }
  },
  createHeroSection: function createHeroSection() {
    var isLoggedIn = localStorage.getItem('token') !== null;
    return "\n            <section class=\"hero-section relative overflow-hidden\">\n                <div class=\"decorative-element bottom-[20%] -left-5 w-32 h-32 decoration-teal opacity-20\">\n                    <svg class=\"w-full h-full\"><use href=\"#flower\"/></svg>\n                </div>\n                <div class=\"hidden md:block decorative-element top-[30%] right-[10%] w-16 h-16 decoration-teal rotate-45 animate-float\">\n                    <svg class=\"w-full h-full\"><use href=\"#dots\"/></svg>\n                </div>\n    \n                <div class=\"container mx-auto px-4\">\n                    <div class=\"flex flex-col md:flex-row md:items-center md:justify-between\">\n                        <div class=\"w-full md:w-1/2 md:order-2\" data-aos=\"fade-left\">\n                            <div class=\"relative tilt-card\">\n                                <picture>\n                                    <source \n                                        media=\"(min-width: 1200px)\" \n                                        srcset=\"images/hero/optimized/hero-section-large.webp\"\n                                        type=\"image/webp\"\n                                    />\n                                    <source \n                                        media=\"(min-width: 800px)\" \n                                        srcset=\"images/hero/optimized/hero-section-medium.webp\"\n                                        type=\"image/webp\"\n                                    />\n                                    <img \n                                        src=\"images/hero/optimized/hero-section-small.webp\" \n                                        alt=\"Urban Infrastructure Hero\" \n                                        class=\"lazyload hero-image w-full h-auto\"\n                                        loading=\"lazy\"\n                                        onerror=\"this.onerror=null; this.src='/images/hero/hero-section.png';\"\n                                    />\n                                </picture>\n                            </div>\n                        </div>\n                        <div class=\"w-full md:w-1/2 text-center md:text-left md:order-1\" data-aos=\"fade-right\">\n                            <h1 class=\"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6\">\n                                Welcome to <span class=\"text-teal-700\">FasCare</span>\n                            </h1>\n                            <p class=\"text-gray-700 text-base sm:text-lg mb-6 md:mb-8 leading-relaxed text-justify md:mr-4\">\n                                Dengan FasCare, Anda memiliki kekuatan untuk melaporkan kerusakan infrastruktur secara langsung, dan membantu menciptakan lingkungan yang lebih aman dan nyaman bagi semua orang.\n                            </p>\n                            ".concat(!isLoggedIn ? "\n                                <div class=\"flex flex-row justify-center md:justify-start space-x-4\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n                                    <button onclick=\"window.location.href='/login'\" class=\"gradient-border-button px-4 sm:px-6 py-2 text-sm sm:text-base\">\n                                        Masuk\n                                    </button>\n                                    <button onclick=\"window.location.href='/register'\" class=\"gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base\">\n                                        Daftar\n                                    </button>\n                                </div>\n                            " : '', "\n                        </div>\n                    </div>\n                </div>\n            </section>\n        ");
  },
  createIntroSection: function createIntroSection() {
    return "\n            <section class=\"bg-white py-12 md:py-16 lg:py-20 relative overflow-hidden\">\n                <div class=\"decorative-element top-20 -right-5 w-24 h-24 decoration-teal rotate-12 animate-float\">\n                    <svg class=\"w-full h-full\"><use href=\"#curved-line\"/></svg>\n                </div>\n                <div class=\"hidden md:block decorative-element bottom-[30%] -left-15 w-24 h-24 decoration-teal opacity-20 animate-pulse\">\n                    <svg class=\"w-full h-full\"><use href=\"#sparkle\"/></svg>\n                </div>\n    \n                <div class=\"container mx-auto px-4 relative z-10\">\n                    <div class=\"max-w-6xl mx-auto\" data-aos=\"fade-up\">\n                        <h2 class=\"section-title\">\n                            Pelaporan Infrastruktur\n                        </h2>\n                        <p class=\"text-gray-700 text-base sm:text-lg leading-relaxed text-justify\">\n                            FasCare merupakan solusi inovatif untuk mengatasi fragmentasi pengelolaan pelaporan dan pengaduan fasilitas di lingkungan kampus. \n                            Saat ini, sistem pelaporan di berbagai unit kampus sering kali masih terpisah, tidak terkoordinasi, dan berpotensi menyebabkan keterlambatan penanganan atau pengabaian laporan mahasiswa maupun staf.\n                            Platform ini bertujuan menciptakan saluran pelaporan terpadu yang memungkinkan civitas akademika melaporkan kerusakan fasilitas, kendala layanan,\n                            maupun keluhan lainnya secara langsung, efisien, dan transparan, guna mewujudkan tata kelola kampus yang lebih responsif, tertib, dan berorientasi pada kenyamanan bersama.\n                        </p>\n                    </div>\n                </div>\n            </section>\n        ";
  },
  createInfrastructureSection: function createInfrastructureSection() {
    // console.log('Creating infrastructure section...');
    // const logWindowSize = () => {
    //     console.log(`Current window width: ${window.innerWidth}px`);
    //     if (window.innerWidth >= 1200) {
    //         console.log('Using large image (width >= 1200px)');
    //     } else if (window.innerWidth >= 800) {
    //         console.log('Using medium image (800px <= width < 1200px)');
    //     } else {
    //         console.log('Using small image (width < 800px)');
    //     }
    // };
    // logWindowSize();
    // window.addEventListener('resize', logWindowSize);
    return "\n            <section class=\"py-12 md:py-16 lg:py-20 relative overflow-hidden\">\n                <div class=\"container mx-auto px-4 relative z-10\">\n                    <div class=\"relative\" data-aos=\"fade-up\">\n                        <div class=\"absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1\"></div>\n                        <div class=\"infrastructure-card tilt-card relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl\">\n                            <h2 class=\"text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center\">\n                                Infrastruktur: Pondasi Kehidupan Modern\n                            </h2>\n                            <div class=\"mb-6\">\n                                <picture>\n                                    <source \n                                        media=\"(min-width: 1200px)\" \n                                        srcset=\"images/optimized/infra-large.webp\"\n                                        type=\"image/webp\"\n                                    />\n                                    <source \n                                        media=\"(min-width: 800px)\" \n                                        srcset=\"images/optimized/infra-medium.webp\"\n                                        type=\"image/webp\"\n                                    />\n                                    <img \n                                        src=\"images/optimized/infra-small.webp\" \n                                        alt=\"Infrastruktur Modern\"\n                                        class=\"lazyload w-full max-w-2xl mx-auto rounded-lg shadow-md\"\n                                        loading=\"lazy\"\n                                        onerror=\"console.error('\xD7 WebP failed, falling back to JPEG'); this.onerror=null; this.src='images/infra.jpeg'; console.log('Using fallback JPEG image');\"\n                                    />\n                                </picture>\n                            </div>\n                            <div class=\"space-y-4 mb-8\">\n                                <p class=\"text-gray-700 text-base sm:text-lg text-justify leading-relaxed\">\n                                    Infrastruktur yang berkualitas adalah kunci pembangunan berkelanjutan, meningkatkan kualitas hidup, dan mendorong pertumbuhan ekonomi masyarakat.\n                                    Dengan adanya infrastruktur yang baik, mobilitas masyarakat menjadi lebih mudah, kegiatan ekonomi berjalan lancar, dan pelayanan publik dapat diberikan secara optimal.\n                                </p>\n                            </div>\n                            <div class=\"text-center\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n                                <button\n                                    class=\"gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base\"\n                                    onclick=\"window.location.href='/artikel';\">\n                                    Pelajari Selengkapnya\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </section>\n        ";
  },
  createStatsSection: function createStatsSection() {
    return "\n            <section class=\"stats-section py-16 md:py-20 relative overflow-hidden\">\n                <div class=\"container mx-auto px-4 relative z-10\">\n                    <h2 class=\"section-title text-white mb-12\" data-aos=\"fade-up\">\n                        Jumlah Laporan\n                    </h2>\n                    <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-7xl mx-auto\">\n                        <div class=\"relative isolate\" data-aos=\"fade-up\" data-aos-delay=\"0\">\n                            <div class=\"stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10\">\n                                <div class=\"text-3xl md:text-4xl font-bold text-teal-800 mb-4\">\n                                    <span class=\"counter\" data-target=\"".concat(this.stats.total, "\">0</span>\n                                </div>\n                                <div class=\"text-lg font-semibold text-teal-800 mb-2\">\n                                    Total Laporan\n                                </div>\n                                <p class=\"text-gray-700\">\n                                    Total laporan yang telah diterima\n                                </p>\n                            </div>\n                        </div>\n    \n                        <div class=\"relative isolate\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n                            <div class=\"stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10\">\n                                <div class=\"text-3xl md:text-4xl font-bold text-teal-800 mb-4\">\n                                    <span class=\"counter\" data-target=\"").concat(this.stats.completed, "\">0</span>\n                                </div>\n                                <div class=\"text-lg font-semibold text-teal-800 mb-2\">\n                                    Laporan Selesai\n                                </div>\n                                <p class=\"text-gray-700\">\n                                    Laporan telah ditindaklanjuti\n                                </p>\n                            </div>\n                        </div>\n    \n                        <div class=\"relative isolate\" data-aos=\"fade-up\" data-aos-delay=\"400\">\n                            <div class=\"stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10\">\n                                <div class=\"text-3xl md:text-4xl font-bold text-teal-800 mb-4\">\n                                    <span class=\"counter\" data-target=\"").concat(this.stats.pending, "\">0</span>\n                                </div>\n                                <div class=\"text-lg font-semibold text-teal-800 mb-2\">\n                                    Laporan Pending\n                                </div>\n                                <p class=\"text-gray-700\">\n                                    Laporan menunggu verifikasi\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </section>\n        ");
  },
  createProcessSection: function createProcessSection() {
    return "\n           <section class=\"py-16 md:py-20 relative overflow-hidden\">\n    <div class=\"decorative-element top-10 -right-5 w-28 h-28 decoration-teal rotate-45 opacity-20\">\n        <svg class=\"w-full h-full\"><use href=\"#sparkle\"/></svg>\n    </div>\n    <div class=\"decorative-element bottom-[20%] -left-10 w-32 h-32 decoration-teal opacity-15\">\n        <svg class=\"w-full h-full\"><use href=\"#flower\"/></svg>\n    </div>\n    <div class=\"container mx-auto px-4 relative z-10\">\n        <h2 class=\"section-title\" data-aos=\"fade-up\">\n            Alur Pelaporan\n        </h2>\n\n        <!-- Mobile Process Steps -->\n        <div class=\"block md:hidden process-steps-mobile\">\n            <div class=\"flex flex-col items-center\" data-aos=\"fade-up\">\n                <span class=\"material-icons-round process-icon mb-4\" style=\"font-size: 44px\">edit_note</span>\n                <h3 class=\"text-lg font-bold mb-3\">Tulis Laporan</h3>\n                <p class=\"text-gray-700 text-md text-center px-4 mb-4\">\n                    Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap\n                </p>\n                <div class=\"process-vertical-line\"></div>\n            </div>\n            \n            <div class=\"flex flex-col items-center\" data-aos=\"fade-up\" data-aos-delay=\"100\">\n                <span class=\"material-icons-round process-icon mb-4\" style=\"font-size: 44px\" >track_changes</span>\n                <h3 class=\"text-lg font-bold mb-3\">Proses Tindak Lanjut</h3>\n                <p class=\"text-md text-gray-700 text-center px-4 mb-4\">\n                    Kami menindaklanjuti dan membalas laporan Anda\n                </p>\n                <div class=\"process-vertical-line\"></div>\n            </div>\n\n            <div class=\"flex flex-col items-center\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n                <span class=\"material-icons-round process-icon mb-4\" style=\"font-size: 44px\">task_alt</span>\n                <h3 class=\"text-lg font-bold mb-3\">Selesai</h3>\n                <p class=\"text-md text-gray-700 text-center px-4 mb-4\">\n                    Laporan ditindaklanjuti\n                </p>\n                <div class=\"process-vertical-line\"></div>\n            </div>\n\n            <div class=\"flex flex-col items-center\" data-aos=\"fade-up\" data-aos-delay=\"300\">\n                <span class=\"material-icons-round process-icon mb-4\"style=\"font-size: 44px\" >rate_review</span>\n                <h3 class=\"text-lg font-bold mb-3\">Beri Tanggapan</h3>\n                <p class=\"text-md text-gray-700 text-center px-4 mb-4\">\n                    Anda dapat menanggapi hasil laporan\n                </p>\n            </div>\n        </div>\n\n        <!-- Desktop Process Steps -->\n        <div class=\"process-steps-desktop hidden md:block max-w-4xl mx-auto\">\n            <div class=\"grid grid-cols-4 gap-8 text-center relative\">\n                <div class=\"absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00899B] to-[#002F35] -z-10\"></div>\n                \n                <div class=\"bg-white p-6 rounded-xl\" data-aos=\"fade-up\">\n                    <span class=\"material-icons-round mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent\" style=\"font-size: 44px\">edit_note</span>\n                    <h3 class=\"text-xl font-bold mb-3\">Tulis Laporan</h3>\n                    <p class=\"text-lg text-gray-700\">\n                        Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap\n                    </p>\n                </div>\n\n                <div class=\"bg-white p-6 rounded-xl\" data-aos=\"fade-up\" data-aos-delay=\"100\">\n                    <span class=\"material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent\" style=\"font-size: 44px\">track_changes</span>\n                    <h3 class=\"text-xl font-bold mb-3\">Proses Tindak Lanjut</h3>\n                    <p class=\"text-lg text-gray-700\">\n                        Kami menindaklanjuti dan membalas laporan Anda\n                    </p>\n                </div>\n\n                <div class=\"bg-white p-6 rounded-xl\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n                    <span class=\"material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent\" style=\"font-size: 44px\">task_alt</span>\n                    <h3 class=\"text-xl font-bold mb-3\">Selesai</h3>\n                    <p class=\"text-lg text-gray-700\">\n                        Laporan ditindaklanjuti\n                    </p>\n                </div>\n\n                <div class=\"bg-white p-6 rounded-xl\" data-aos=\"fade-up\" data-aos-delay=\"300\">\n                    <span class=\"material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent\" style=\"font-size: 44px\">rate_review</span>\n                    <h3 class=\"text-xl font-bold mb-3\">Beri Tanggapan</h3>\n                    <p class=\"text-lg text-gray-700\">\n                        Anda dapat menanggapi hasil laporan\n                    </p>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"text-center mt-10\" data-aos=\"fade-up\" data-aos-delay=\"400\">\n            <button id=\"reportButton\" class=\"gradient-button text-white px-6 py-2\">\n                Lapor Sekarang\n            </button>\n        </div>\n    </div>\n</section>\n        ";
  },
  createTestimonialsSection: function createTestimonialsSection() {
    var testimonialCards = this.testimonials.length > 0 ? this.testimonials.map(function (testimonial, index) {
      return "\n                <div class=\"relative\" data-aos=\"fade-up\" data-aos-delay=\"".concat(index * 100, "\">\n                    <div class=\"absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1\"></div>\n                    <div class=\"testimonial-card flex flex-col h-full tilt-card relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl\">\n                        <div class=\"flex-grow mb-6\">\n                            <p class=\"text-gray-700\">").concat(testimonial.text, "</p>\n                        </div>\n                        \n                        <!-- Profile section -->\n                        <div class=\"flex items-center mt-auto\">\n                            <div class=\"min-w-[44px] min-h-[44px] flex items-center justify-center\">\n                                <span class=\"material-icons-round\" style=\"font-size: 48px; color: #00899B;\">account_circle</span>\n                            </div>\n                            <div class=\"ml-3\">\n                                <h4 class=\"testimonial-name text-lg font-semibold\">").concat(testimonial.name, "</h4>\n                                <div class=\"flex text-yellow-400 gap-0.5\">\n                                    ").concat(Array(testimonial.rating).fill('<span class="material-icons-round">star</span>').join(''), "\n                                    ").concat(Array(5 - testimonial.rating).fill('<span class="material-icons-round">star_outline</span>').join(''), "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ");
    }).join('') : "\n                <div class=\"col-span-3 relative\" data-aos=\"fade-up\">\n                    <div class=\"absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1\"></div>\n                    <div class=\"relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center\">\n                        <div class=\"min-w-[44px] min-h-[44px] flex items-center justify-center mx-auto\">\n                            <span class=\"material-icons-round\" style=\"font-size: 48px;\">rate_review</span>\n                        </div>\n                        <p class=\"text-lg\">Belum ada ulasan</p>\n                    </div>\n                </div>";
    return "\n            <section class=\"bg-gray-50 py-16 md:py-20 relative overflow-hidden\">\n                <div class=\"container mx-auto px-4 relative z-10\">\n                    <h2 class=\"section-title\" data-aos=\"fade-up\">\n                        Apa Kata Mereka\n                    </h2>\n                    <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto\">\n                        ".concat(testimonialCards, "\n                    </div>\n                </div>\n            </section>\n        ");
  },
  initCounterAnimation: function initCounterAnimation() {
    var counters = document.querySelectorAll('.counter');
    var options = {
      duration: 2.5,
      useGrouping: true,
      useEasing: true,
      separator: ',',
      decimal: '.'
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counter = entry.target;
          var target = parseInt(counter.getAttribute('data-target'));
          var countUp = new _countup.CountUp(counter, target, options);

          if (!countUp.error) {
            countUp.start();
          } else {
            console.error(countUp.error);
          }

          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.1
    });
    counters.forEach(function (counter) {
      return observer.observe(counter);
    });
  },
  attachEventListeners: function attachEventListeners() {
    var reportButton = document.getElementById('reportButton');

    if (reportButton) {
      reportButton.addEventListener('click', function () {
        var token = localStorage.getItem('token');

        if (token) {
          window.location.href = '/pelaporan';
        } else {
          window.location.href = '/register';
        }
      });
    }

    window.addEventListener('load', function () {
      return window.scrollTo(0, 0);
    });
    window.addEventListener('popstate', function () {
      return window.scrollTo(0, 0);
    });
  },
  cleanup: function cleanup() {
    var reportButton = document.getElementById('reportButton');

    if (reportButton) {
      reportButton.removeEventListener('click', function () {});
    }

    _Loading["default"].hide();
  }
};
var _default = HomePage;
exports["default"] = _default;