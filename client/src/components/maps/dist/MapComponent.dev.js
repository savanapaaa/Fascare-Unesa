"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MapComponent =
/*#__PURE__*/
function () {
  function MapComponent(containerElementId) {
    _classCallCheck(this, MapComponent);

    this.containerElementId = containerElementId;
    this.map = null;
    this.marker = null;
    this.onLocationSelect = null;
    this.isInitialized = false;
    var mapStyle = document.createElement('style');
    mapStyle.textContent = "\n    #".concat(this.containerElementId, " {\n      height: 400px !important;\n      width: 100% !important;\n      z-index: 1;\n      background: #f3f4f6;\n      border-radius: 0.5rem;\n      overflow: hidden;\n      position: relative;\n    }\n    \n    .leaflet-container {\n      height: 100% !important;\n      width: 100% !important;\n      background: #f3f4f6 !important;\n    }\n    \n    .location-popup {\n      font-size: 14px;\n      line-height: 1.4;\n    }\n    \n    .leaflet-control-zoom {\n      border: none !important;\n      margin: 1rem !important;\n    }\n    \n    .leaflet-control-zoom a {\n      background: white !important;\n      border: 1px solid #e5e7eb !important;\n      color: #374151 !important;\n      width: 32px !important;\n      height: 32px !important;\n      line-height: 30px !important;\n      border-radius: 8px !important;\n      margin-bottom: 8px !important;\n    }\n    \n    .leaflet-control-zoom a:hover {\n      background: #f9fafb !important;\n      color: #111827 !important;\n    }\n  ");
    document.head.appendChild(mapStyle);
  }

  _createClass(MapComponent, [{
    key: "waitForLeaflet",
    value: function waitForLeaflet() {
      var maxAttempts,
          _args = arguments;
      return regeneratorRuntime.async(function waitForLeaflet$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              maxAttempts = _args.length > 0 && _args[0] !== undefined ? _args[0] : 10;
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                var attempts = 0;

                var checkLeaflet = function checkLeaflet() {
                  if (typeof L !== 'undefined') {
                    resolve(true);
                    return;
                  }

                  attempts++;

                  if (attempts >= maxAttempts) {
                    reject(new Error('Leaflet tidak dapat dimuat'));
                    return;
                  }

                  setTimeout(checkLeaflet, 200);
                };

                checkLeaflet();
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "initializeMap",
    value: function initializeMap() {
      var _this = this;

      var address,
          mapContainer,
          koordinat,
          initialLat,
          initialLng,
          initialZoom,
          _koordinat,
          clickTimeout,
          _mapContainer,
          _args2 = arguments;

      return regeneratorRuntime.async(function initializeMap$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              address = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(this.waitForLeaflet());

            case 4:
              mapContainer = document.getElementById(this.containerElementId);

              if (mapContainer) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", null);

            case 7:
              if (!this.isInitialized) {
                _context2.next = 14;
                break;
              }

              if (!address) {
                _context2.next = 13;
                break;
              }

              _context2.next = 11;
              return regeneratorRuntime.awrap(this.getCoordinatesFromAddress(address));

            case 11:
              koordinat = _context2.sent;

              if (koordinat) {
                this.updateMarker(koordinat.latitude, koordinat.longitude, address);
              }

            case 13:
              return _context2.abrupt("return", this.getMapState());

            case 14:
              mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 rounded-lg"><span class="material-icons-round animate-spin mr-2">sync</span>Memuat peta...</div>';
              initialLat = -2.548926;
              initialLng = 118.014863;
              initialZoom = 5;

              if (!address) {
                _context2.next = 29;
                break;
              }

              _context2.prev = 19;
              _context2.next = 22;
              return regeneratorRuntime.awrap(this.getCoordinatesFromAddress(address));

            case 22:
              _koordinat = _context2.sent;

              if (_koordinat) {
                initialLat = _koordinat.latitude;
                initialLng = _koordinat.longitude;
                initialZoom = 15;
              }

              _context2.next = 29;
              break;

            case 26:
              _context2.prev = 26;
              _context2.t0 = _context2["catch"](19);
              console.error('Error getting coordinates:', _context2.t0);

            case 29:
              mapContainer.innerHTML = '';
              this.map = L.map(this.containerElementId, {
                zoomControl: true,
                scrollWheelZoom: true,
                dragging: true,
                maxZoom: 18,
                preferCanvas: true
              }).setView([initialLat, initialLng], initialZoom);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                minZoom: 4,
                tileSize: 256,
                keepBuffer: 2
              }).addTo(this.map);
              this.map.on('click', function (e) {
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(function () {
                  _this.updateMarker(e.latlng.lat, e.latlng.lng);

                  _this.reverseGeocode(e.latlng.lat, e.latlng.lng);
                }, 300);
              });

              if (address) {
                this.updateMarker(initialLat, initialLng, address);
              }

              this.isInitialized = true;
              return _context2.abrupt("return", this.getMapState());

            case 38:
              _context2.prev = 38;
              _context2.t1 = _context2["catch"](1);
              console.error('Error initializing map:', _context2.t1);
              _mapContainer = document.getElementById(this.containerElementId);

              if (_mapContainer) {
                _mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-red-100 rounded-lg text-red-600"><span class="material-icons-round mr-2">error</span>Gagal memuat peta</div>';
              }

              return _context2.abrupt("return", null);

            case 44:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[1, 38], [19, 26]]);
    }
  }, {
    key: "getMapState",
    value: function getMapState() {
      return {
        map: this.map,
        marker: this.marker,
        coordinates: this.marker ? {
          latitude: this.marker.getLatLng().lat,
          longitude: this.marker.getLatLng().lng
        } : null
      };
    }
  }, {
    key: "updateMarker",
    value: function updateMarker(lat, lng) {
      var _this2 = this;

      var popupContent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Lokasi yang dipilih';
      if (!this.map) return;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
        riseOnHover: true,
        title: popupContent,
        alt: 'Marker lokasi'
      }).addTo(this.map);
      var popup = L.popup({
        maxWidth: 300,
        minWidth: 200,
        autoClose: false,
        closeOnClick: false,
        className: 'location-popup'
      }).setContent(popupContent);
      this.marker.bindPopup(popup).openPopup();
      this.map.flyTo([lat, lng], 15, {
        duration: 1,
        easeLinearity: 0.25
      });
      var dragTimeout;
      this.marker.on('dragend', function _callee2(e) {
        return regeneratorRuntime.async(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (dragTimeout) clearTimeout(dragTimeout);
                dragTimeout = setTimeout(function _callee() {
                  var position;
                  return regeneratorRuntime.async(function _callee$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          position = e.target.getLatLng();
                          _context3.next = 3;
                          return regeneratorRuntime.awrap(_this2.reverseGeocode(position.lat, position.lng));

                        case 3:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  });
                }, 300);

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        });
      });

      if (this.onLocationSelect) {
        this.onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: popupContent
        });
      }
    }
  }, {
    key: "getCoordinatesFromAddress",
    value: function getCoordinatesFromAddress(address) {
      var response, data;
      return regeneratorRuntime.async(function getCoordinatesFromAddress$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(fetch("https://nominatim.openstreetmap.org/search?format=json&q=".concat(encodeURIComponent(address), ", Indonesia&limit=1&accept-language=id"), {
                headers: {
                  'User-Agent': 'FasCare App',
                  'Accept': 'application/json'
                }
              }));

            case 3:
              response = _context5.sent;

              if (response.ok) {
                _context5.next = 6;
                break;
              }

              throw new Error("HTTP error! status: ".concat(response.status));

            case 6:
              _context5.next = 8;
              return regeneratorRuntime.awrap(response.json());

            case 8:
              data = _context5.sent;

              if (!(data && data[0])) {
                _context5.next = 11;
                break;
              }

              return _context5.abrupt("return", {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
              });

            case 11:
              return _context5.abrupt("return", null);

            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](0);
              console.error('Error in geocoding:', _context5.t0);
              return _context5.abrupt("return", null);

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 14]]);
    }
  }, {
    key: "reverseGeocode",
    value: function reverseGeocode(lat, lng) {
      var response, data, popup;
      return regeneratorRuntime.async(function reverseGeocode$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=".concat(lat, "&lon=").concat(lng, "&accept-language=id"), {
                headers: {
                  'User-Agent': 'FasCare App',
                  'Accept': 'application/json'
                }
              }));

            case 3:
              response = _context6.sent;

              if (response.ok) {
                _context6.next = 6;
                break;
              }

              throw new Error("HTTP error! status: ".concat(response.status));

            case 6:
              _context6.next = 8;
              return regeneratorRuntime.awrap(response.json());

            case 8:
              data = _context6.sent;

              if (data.display_name) {
                if (this.marker) {
                  popup = this.marker.getPopup();

                  if (popup) {
                    popup.setContent(data.display_name);
                    popup.update();
                  } else {
                    this.marker.bindPopup(data.display_name).openPopup();
                  }
                }

                if (this.onLocationSelect) {
                  this.onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    address: data.display_name
                  });
                }
              }

              _context6.next = 16;
              break;

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](0);
              console.error('Error in reverse geocoding:', _context6.t0);

              if (this.marker) {
                this.marker.bindPopup('Tidak dapat mendapatkan alamat lokasi').openPopup();
              }

            case 16:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
  }, {
    key: "setLocationSelectCallback",
    value: function setLocationSelectCallback(callback) {
      this.onLocationSelect = callback;
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      var _this3 = this;

      if (this.map) {
        this.map.off();
        this.map.eachLayer(function (layer) {
          _this3.map.removeLayer(layer);
        });
        this.map.remove();
        this.map = null;
      }

      if (this.marker) {
        this.marker.off();
        this.marker = null;
      }

      this.onLocationSelect = null;
      this.isInitialized = false;
      var mapContainer = document.getElementById(this.containerElementId);

      if (mapContainer) {
        var newContainer = mapContainer.cloneNode(true);
        mapContainer.parentNode.replaceChild(newContainer, mapContainer);
      }
    }
  }]);

  return MapComponent;
}();

var _default = MapComponent;
exports["default"] = _default;