"use strict";

var _authService = _interopRequireDefault(require("../services/auth-service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FormLogin =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(FormLogin, _HTMLElement);

  function FormLogin() {
    var _this;

    _classCallCheck(this, FormLogin);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormLogin).call(this));
    _this.isTogglingPassword = false;
    return _this;
  }

  _createClass(FormLogin, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.innerHTML = "\n        <div class=\"backdrop-blur-sm bg-white/30 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full border border-white/50\">\n          <div class=\"flex items-center mb-6\">\n            <a href=\"/\" \n               class=\"text-white hover:text-[#00899B] transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center\"\n               aria-label=\"Kembali ke beranda\">\n              <i class=\"material-icons-round\">arrow_back</i>\n            </a>\n            \n            <h1 tabindex=0 class=\"text-xl sm:text-2xl font-bold text-center flex-1 text-white tracking-wider\">\n              Login ke <span class=\"text-[#00899B]\">FasCare</span>\n            </h1>\n          </div>\n          \n          <form class=\"space-y-6\">\n            <div class=\"relative\">\n              <input \n                type=\"email\" \n                id=\"email\" \n                name=\"email\" \n                class=\"peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide\" \n                placeholder=\"Email\"\n                required>\n              <span class=\"absolute inset-y-0 right-3 flex items-center text-white\">\n                <i class=\"material-icons-round\">mail</i>\n              </span>\n              <label \n                for=\"email\" \n                class=\"absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider\n                peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide\n                peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider\">\n                Email\n              </label>\n            </div>\n\n            <div class=\"relative\">\n              <input \n                type=\"password\" \n                id=\"password\" \n                name=\"password\" \n                class=\"peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide\" \n                placeholder=\"Password\"\n                required>\n              <button \n                type=\"button\" \n                id=\"togglePassword\" \n                class=\"absolute inset-y-0 right-3 flex items-center text-white\">\n                <i class=\"material-icons-round\">visibility</i>\n              </button>\n              <label \n                for=\"password\" \n                class=\"absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider\n                peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide\n                peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider\">\n                Password\n              </label>\n            </div>\n\n            <div class=\"flex items-center justify-between\">\n              <div class=\"flex items-start space-x-3 min-w-[44px] min-h-[44px]\">\n                <input \n                  type=\"checkbox\" \n                  id=\"remember\" \n                  class=\"h-5 w-5 text-[#00899B] focus:ring-[#00899B]\">\n                <label tabindex=0\n                  for=\"remember\" \n                  class=\"text-sm font-medium text-white tracking-wide\">\n                  Ingat saya\n                </label>\n              </div>\n              \n              <a href=\"/forgot-password\" \n                 class=\"text-sm font-medium text-white hover:text-[#00899B] transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center tracking-wide\">\n                Lupa Password?\n              </a>\n            </div>\n\n            <button \n              type=\"submit\" \n              class=\"w-full py-3 font-semibold text-white rounded-2xl gradient-button\">\n              Login\n            </button>\n          </form>\n          \n          <p tabindex=0 class=\"mt-6 text-sm text-center font-medium text-white tracking-wide\">\n            Belum punya akun? \n            <a href=\"/register\" class=\"font-bold hover:underline inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-[#002F35]\">Daftar</a>\n          </p>\n        </div>\n      ";
      this.attachTogglePassword();
      this.attachFormValidation();
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(email) {
      if (!email) return 'Email harus diisi';
      var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!email.includes('@')) return 'Email harus mengandung @';
      if (!email.includes('.')) return 'Email harus mengandung domain yang valid';

      if (!emailRegex.test(email)) {
        if (email.split('@').length > 2) return 'Email tidak boleh mengandung lebih dari satu @';
        if (email.endsWith('@')) return 'Email harus memiliki domain setelah @';
        if (email.startsWith('@')) return 'Email harus memiliki username sebelum @';
        if (!/^[a-zA-Z0-9._-]+/.test(email)) return 'Email hanya boleh mengandung huruf, angka, titik, underscore, dan dash';
        return 'Format email tidak valid';
      }

      var _email$split = email.split('@'),
          _email$split2 = _slicedToArray(_email$split, 2),
          domain = _email$split2[1];

      if (!domain) return 'Domain email tidak valid';
      if (!domain.includes('.')) return 'Domain email harus mengandung ekstensi yang valid';
      if (domain.startsWith('.') || domain.endsWith('.')) return 'Format domain email tidak valid';
      return null;
    }
  }, {
    key: "validatePassword",
    value: function validatePassword(password) {
      if (!password) return 'Password harus diisi';
      if (password.length < 6) return 'Password minimal 6 karakter';
      return null;
    }
  }, {
    key: "attachFormValidation",
    value: function attachFormValidation() {
      var _this2 = this;

      var form = this.querySelector('form');
      var emailInput = this.querySelector('#email');
      var passwordInput = this.querySelector('#password');
      var rememberCheckbox = this.querySelector('#remember');
      emailInput.addEventListener('input', function () {
        var error = _this2.validateEmail(emailInput.value.trim());

        if (error) {
          emailInput.classList.add('border-red-500');
        } else {
          emailInput.classList.remove('border-red-500');
        }
      });
      passwordInput.addEventListener('input', function () {
        var error = _this2.validatePassword(passwordInput.value);

        if (error) {
          passwordInput.classList.add('border-red-500');
        } else {
          passwordInput.classList.remove('border-red-500');
        }
      });
      emailInput.addEventListener('blur', function () {
        var error = _this2.validateEmail(emailInput.value.trim());

        if (error) {
          Swal.fire({
            title: 'Format Email Salah',
            text: error,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
      form.addEventListener('submit', function _callee(e) {
        var emailError, passwordError, response, user;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e.preventDefault();
                emailError = _this2.validateEmail(emailInput.value.trim());

                if (!emailError) {
                  _context.next = 5;
                  break;
                }

                Swal.fire({
                  title: 'Format Email Salah',
                  text: emailError,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return _context.abrupt("return");

              case 5:
                passwordError = _this2.validatePassword(passwordInput.value);

                if (!passwordError) {
                  _context.next = 9;
                  break;
                }

                Swal.fire({
                  title: 'Format Password Salah',
                  text: passwordError,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return _context.abrupt("return");

              case 9:
                _context.prev = 9;
                Swal.fire({
                  title: 'Memproses',
                  text: 'Mohon tunggu...',
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  willOpen: function willOpen() {
                    Swal.showLoading();
                  }
                });
                _context.next = 13;
                return regeneratorRuntime.awrap(_authService["default"].login(emailInput.value.trim(), passwordInput.value, rememberCheckbox.checked // Kirim status checkbox ke API
                ));

              case 13:
                response = _context.sent;

                if (!(response.status === 'success')) {
                  _context.next = 22;
                  break;
                }

                _context.next = 17;
                return regeneratorRuntime.awrap(Swal.fire({
                  title: 'Berhasil!',
                  text: 'Login berhasil',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }));

              case 17:
                form.reset();
                user = response.data.user;

                if (user.role === 'admin' || user.role === 'superadmin') {
                  window.location.href = '/admin';
                } else {
                  window.location.href = '/pelaporan';
                }

                _context.next = 23;
                break;

              case 22:
                throw new Error(response.message || 'Email atau password salah');

              case 23:
                _context.next = 30;
                break;

              case 25:
                _context.prev = 25;
                _context.t0 = _context["catch"](9);
                console.error('Login Error:', _context.t0);
                _context.next = 30;
                return regeneratorRuntime.awrap(Swal.fire({
                  title: 'Gagal!',
                  text: _context.t0.message || 'Email atau password salah. Silakan coba lagi.',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                }));

              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[9, 25]]);
      });
    }
  }, {
    key: "attachTogglePassword",
    value: function attachTogglePassword() {
      var _this3 = this;

      var passwordInput = this.querySelector('#password');
      var togglePassword = this.querySelector('#togglePassword');
      var toggleIcon = togglePassword.querySelector('i');
      togglePassword.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this3.isTogglingPassword = true;
        var isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
        setTimeout(function () {
          _this3.isTogglingPassword = false;
        }, 100);
      });
    }
  }]);

  return FormLogin;
}(_wrapNativeSuper(HTMLElement));

customElements.define('form-login', FormLogin);