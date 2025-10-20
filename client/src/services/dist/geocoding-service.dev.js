"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeocodingService =
/*#__PURE__*/
function () {
  function GeocodingService() {
    _classCallCheck(this, GeocodingService);
  }

  _createClass(GeocodingService, null, [{
    key: "getCoordinatesFromAddress",
    value: function getCoordinatesFromAddress(address) {
      var nominatimUrl, response, data;
      return regeneratorRuntime.async(function getCoordinatesFromAddress$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&q=".concat(encodeURIComponent(address), "&limit=1");
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(fetch(nominatimUrl, {
                headers: {
                  'User-Agent': 'FasCare App'
                }
              }));

            case 4:
              response = _context.sent;
              _context.next = 7;
              return regeneratorRuntime.awrap(response.json());

            case 7:
              data = _context.sent;

              if (!(data.length > 0)) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return", {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name
              });

            case 12:
              throw new Error('Alamat tidak ditemukan');

            case 13:
              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](1);
              console.error('Gagal mengambil koordinat:', _context.t0);
              return _context.abrupt("return", null);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 15]]);
    }
  }]);

  return GeocodingService;
}();

var _default = GeocodingService;
exports["default"] = _default;