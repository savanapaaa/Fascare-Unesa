"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Navbar = require("../../components/common/Navbar");

var _Footer = require("../../components/common/Footer");

var _Loading = _interopRequireDefault(require("../../components/common/Loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TentangKami = {
  developers: [{
    name: 'Andreas Pujo Santoso',
    position: 'Frontend Developer',
    university: 'Universitas Lampung',
    image: '/images/profile/andreas.jpg',
    imagePosition: 'center top'
  }, {
    name: 'Chiboy Cristian Sibarani',
    position: 'Frontend Developer',
    university: 'Universitas Negeri Surabaya',
    image: '/images/profile/ciboy.png',
    imagePosition: 'center top'
  }, {
    name: 'Muhammad Danu Seta Wiardana',
    position: 'Backend Developer & Project Manager',
    university: 'Universitas Lampung',
    image: '/images/profile/danu.jpg',
    imagePosition: 'center top'
  }, {
    name: 'Savana Putra Aditama',
    position: 'Backend Developer',
    university: 'Universitas Negeri Surabaya',
    image: '/images/profile/savana.jpg',
    imagePosition: 'center top'
  }],
  contacts: [{
    icon: 'location_on',
    title: 'Alamat',
    content: 'Jakarta, Indonesia'
  }, {
    icon: 'email',
    title: 'Email',
    content: 'contact@urbanaid.id'
  }, {
    icon: 'phone',
    title: 'Telepon',
    content: '+628 1234 5678'
  }, {
    icon: 'schedule',
    title: 'Jam Kerja',
    content: 'Senin - Jumat: 08.00 - 17.00 WIB'
  }],
  init: function init() {
    var app;
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              app = document.getElementById('app');
              app.innerHTML = this.render();
              AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
              });
              this.initTilt();
            } catch (error) {
              console.error('Error initializing about page:', error);
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  },
  initTilt: function initTilt() {
    var cards = document.querySelectorAll('.tilt-card');
    VanillaTilt.init(cards, {
      max: 8,
      speed: 400,
      scale: 1.03,
      glare: true,
      'max-glare': 0.3,
      transition: true,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
  },
  createDeveloperCards: function createDeveloperCards() {
    return this.developers.map(function (dev, index) {
      return "\n            <div class=\"relative group h-full\" data-aos=\"zoom-in-up\" data-aos-delay=\"".concat(index * 150, "\">\n                <div class=\"absolute -inset-0.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000\"></div>\n                <div class=\"relative bg-white rounded-2xl p-8 h-full flex flex-col tilt-card\">\n                    <div class=\"absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#00899B] to-[#002F35] rounded-lg rotate-45\"></div>\n                    <div class=\"relative flex items-center justify-center mt-2 mb-6\">\n                        ").concat(dev.image ? "<div class=\"w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00899B]/20\">\n                                <img \n                                    src=\"".concat(dev.image, "\" \n                                    alt=\"").concat(dev.name, "\" \n                                    class=\"w-full h-full object-cover transition-transform duration-300 group-hover:scale-110\"\n                                    style=\"object-position: ").concat(dev.imagePosition || 'center center', "\"\n                                    onerror=\"this.style.display='none'; this.nextElementSibling.style.display='block';\"\n                                >\n                                <span class=\"material-icons-round hidden\" style=\"font-size: 128px; color: #00899B; filter: drop-shadow(0 4px 6px rgba(0, 137, 155, 0.2))\">account_circle</span>\n                               </div>") : "<div class=\"w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00899B]/20 flex items-center justify-center\">\n                                <span class=\"material-icons-round\" style=\"font-size: 128px; color: #00899B; filter: drop-shadow(0 4px 6px rgba(0, 137, 155, 0.2))\">account_circle</span>\n                               </div>", "\n                    </div>\n                    <div class=\"space-y-3 text-center flex-grow flex flex-col justify-center\">\n                        <h3 class=\"font-bold text-xl text-gray-900\">").concat(dev.name, "</h3>\n                        <div class=\"h-0.5 w-12 mx-auto bg-gradient-to-r from-[#00899B] to-[#002F35]\"></div>\n                        <p class=\"text-[#00899B] font-semibold\">").concat(dev.position, "</p>\n                        <p class=\"text-gray-600 text-sm\">").concat(dev.university, "</p>\n                    </div>\n                </div>\n            </div>\n        ");
    }).join('');
  },
  createContactItems: function createContactItems() {
    return this.contacts.map(function (contact, index) {
      return "\n            <div class=\"group\" data-aos=\"fade-up\" data-aos-delay=\"".concat(index * 100, "\">\n                <div class=\"relative p-6 rounded-2xl transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-gray-50\">\n                    <div class=\"flex items-start gap-4\">\n                        <div class=\"relative\">\n                            <div class=\"absolute inset-0 bg-[#00899B]/20 rounded-xl blur-lg transform group-hover:scale-110 transition duration-500\"></div>\n                            <div class=\"relative bg-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition duration-500\">\n                                <span class=\"material-icons-round text-3xl text-[#00899B]\">").concat(contact.icon, "</span>\n                            </div>\n                        </div>\n                        <div class=\"flex-1 pt-1\">\n                            <h3 class=\"font-bold text-gray-900 mb-2 group-hover:text-[#00899B] transition duration-300\">").concat(contact.title, "</h3>\n                            <p class=\"text-gray-700 group-hover:translate-x-1 transition duration-300\">").concat(contact.content, "</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ");
    }).join('');
  },
  render: function render() {
    return "\n            ".concat((0, _Navbar.Navbar)(), "\n            <main class=\"min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100\">\n                <div class=\"absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none\">\n                    <div class=\"absolute top-1/4 left-1/4 w-64 h-64 bg-[#00899B]/10 rounded-full blur-3xl\"></div>\n                    <div class=\"absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#002F35]/5 rounded-full blur-3xl\"></div>\n                </div>\n\n                <div class=\"relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20\">\n                    <div class=\"text-center mb-16 md:mb-24\" data-aos=\"fade-down\">\n                        <div class=\"inline-block\">\n                            <h1 class=\"text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00899B] to-[#002F35] mb-6\">\n                                Apa Itu FasCare?\n                            </h1>\n                            <div class=\"h-1.5 w-32 mx-auto bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full\"></div>\n                        </div>\n                    </div>\n                    \n                    <div class=\"relative max-w-7xl mx-auto mb-24\" data-aos=\"fade-up\">\n                        <div class=\"absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1\"></div>\n                        <div class=\"relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl\">\n                            <div class=\"absolute -top-6 -left-6 w-12 h-12 bg-[#00899B] rounded-full flex items-center justify-center shadow-lg\">\n                                <span class=\"material-icons-round text-white text-2xl\">lightbulb</span>\n                            </div>\n                            <p class=\"text-gray-700 sm:text-lg mb-8 leading-relaxed text-justify\">\n                                FasCare adalah sebuah aplikasi berbasis teknologi yang dirancang untuk menjadi solusi praktis dalam menangani pelaporan kerusakan infrastruktur. Dengan FasCare, pengguna dapat dengan mudah melaporkan kondisi infrastruktur yang rusak, seperti jalan berlubang, lampu jalan yang mati, atau jembatan yang rusak, secara real-time.\n                            </p>\n                            <p class=\"text-gray-700 sm:text-lg leading-relaxed text-justify\">\n                                FasCare hadir untuk menjawab kebutuhan akan sistem pelaporan yang efisien, mendukung perbaikan infrastruktur lebih cepat, dan menciptakan lingkungan yang aman serta nyaman bagi masyarakat. Dengan FasCare, setiap warga dapat berkontribusi dalam menjaga kualitas infrastruktur di lingkungan mereka.\n                            </p>\n                        </div>\n                    </div>\n\n                    <div class=\"mb-24\">\n                        <h2 class=\"text-3xl md:text-4xl font-bold text-center mb-16\" data-aos=\"fade-up\">\n                            <span class=\"relative inline-block mb-8\">\n                                Tim Pengembang\n                                <div class=\"absolute -bottom-4 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full\"></div>\n                            </span>\n                        </h2>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12\">\n                            ").concat(this.createDeveloperCards(), "\n                        </div>\n                    </div>\n\n                    <div>\n                        <h2 class=\"text-3xl md:text-4xl font-bold text-center mb-16\" data-aos=\"fade-up\">\n                            <span class=\"relative inline-block\">\n                                Hubungi Kami\n                                <div class=\"absolute -bottom-4 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full\"></div>\n                            </span>\n                        </h2>\n                        <div class=\"relative max-w-7xl mx-auto\" data-aos=\"fade-up\">\n                            <div class=\"absolute inset-0 bg-gradient-to-r from-[#00899B]/10 to-[#002F35]/10 rounded-3xl blur-2xl transform rotate-1\"></div>\n                            <div class=\"relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl\">\n                                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-8\">\n                                    ").concat(this.createContactItems(), "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </main>\n            ").concat((0, _Footer.Footer)(), "\n        ");
  },
  cleanup: function cleanup() {
    _Loading["default"].hide();
  }
};
var _default = TentangKami;
exports["default"] = _default;