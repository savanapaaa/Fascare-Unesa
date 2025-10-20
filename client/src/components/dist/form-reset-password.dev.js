"use strict";

var _authService = _interopRequireDefault(require("../services/auth-service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var FormResetPassword =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(FormResetPassword, _HTMLElement);

  function FormResetPassword() {
    var _this;

    _classCallCheck(this, FormResetPassword);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormResetPassword).call(this));
    _this.isTogglingPassword = false;
    return _this;
  }

  _createClass(FormResetPassword, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.innerHTML = "\n      <div class=\"backdrop-blur-sm bg-white/30 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full border border-white/50\">\n        <div class=\"flex items-center mb-6\">\n          <a href=\"/login\" \n             class=\"text-white hover:text-[#00899B] transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center\"\n             aria-label=\"Kembali ke login\">\n            <i class=\"material-icons-round\">arrow_back</i>\n          </a>\n          \n          <h1 tabindex=0 class=\"text-xl sm:text-2xl font-bold text-center flex-1 text-white tracking-wider\">\n            Reset Password <span class=\"text-[#00899B]\">FasCare</span>\n          </h1>\n        </div>\n\n        <p class=\"text-white text-sm mb-6 text-center\">\n          Masukkan data diri Anda untuk mengatur ulang password.\n        </p>\n        \n        <form class=\"space-y-6\">\n          <!-- Nama -->\n          <div class=\"relative\">\n            <input \n              type=\"text\" \n              id=\"nama\" \n              name=\"nama\" \n              class=\"peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide\" \n              placeholder=\"Nama Lengkap\"\n              required>\n            <span class=\"absolute inset-y-0 right-3 flex items-center text-white\">\n              <i class=\"material-icons-round\">person</i>\n            </span>\n            <label \n              for=\"nama\" \n              class=\"absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider\n              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide\n              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider\">\n              Nama Lengkap\n            </label>\n          </div>\n\n          <!-- Email -->\n          <div class=\"relative\">\n            <input \n              type=\"email\" \n              id=\"email\" \n              name=\"email\" \n              class=\"peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide\" \n              placeholder=\"Email\"\n              required>\n            <span class=\"absolute inset-y-0 right-3 flex items-center text-white\">\n              <i class=\"material-icons-round\">mail</i>\n            </span>\n            <label \n              for=\"email\" \n              class=\"absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider\n              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide\n              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider\">\n              Email\n            </label>\n          </div>\n\n          <!-- Password Baru -->\n          <div class=\"relative\">\n            <input \n              type=\"password\" \n              id=\"password\" \n              name=\"password\" \n              class=\"peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide\" \n              placeholder=\"Password Baru\"\n              required>\n            <button \n              type=\"button\" \n              id=\"togglePassword\" \n              class=\"absolute inset-y-0 right-3 flex items-center text-white\">\n              <i class=\"material-icons-round\">visibility</i>\n            </button>\n            <label \n              for=\"password\" \n              class=\"absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider\n              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide\n              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider\">\n              Password Baru\n            </label>\n          </div>\n\n          <button \n            type=\"submit\" \n            class=\"w-full py-3 font-semibold text-white rounded-2xl gradient-button\">\n            Reset Password\n          </button>\n        </form>\n      </div>\n    ";
      this.attachTogglePassword();
      this.attachFormValidation();
    }
  }, {
    key: "validateName",
    value: function validateName(name) {
      if (!name) return 'Nama lengkap harus diisi';
      if (name.length < 3) return 'Nama lengkap minimal 3 karakter';
      if (!/^[a-zA-Z\s]*$/.test(name)) return 'Nama lengkap hanya boleh berisi huruf';
      return null;
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(email) {
      if (!email) return 'Email harus diisi';
      var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) return 'Format email tidak valid';
      return null;
    }
  }, {
    key: "validatePassword",
    value: function validatePassword(password) {
      if (!password) return 'Password harus diisi';
      if (password.length < 6) return 'Password minimal 6 karakter';
      if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf besar';
      if (!/[a-z]/.test(password)) return 'Password harus mengandung huruf kecil';
      if (!/[0-9]/.test(password)) return 'Password harus mengandung angka';
      return null;
    }
  }, {
    key: "attachFormValidation",
    value: function attachFormValidation() {
      var _this2 = this;

      var form = this.querySelector('form');
      var namaInput = this.querySelector('#nama');
      var emailInput = this.querySelector('#email');
      var passwordInput = this.querySelector('#password');
      namaInput.addEventListener('input', function () {
        var error = _this2.validateName(namaInput.value.trim());

        if (error) {
          namaInput.classList.add('border-red-500');
        } else {
          namaInput.classList.remove('border-red-500');
        }
      });
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
      form.addEventListener('submit', function _callee(e) {
        var nameError, emailError, passwordError, response;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e.preventDefault();
                nameError = _this2.validateName(namaInput.value.trim());

                if (!nameError) {
                  _context.next = 5;
                  break;
                }

                Swal.fire({
                  title: 'Format Nama Salah',
                  text: nameError,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return _context.abrupt("return");

              case 5:
                emailError = _this2.validateEmail(emailInput.value.trim());

                if (!emailError) {
                  _context.next = 9;
                  break;
                }

                Swal.fire({
                  title: 'Format Email Salah',
                  text: emailError,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return _context.abrupt("return");

              case 9:
                passwordError = _this2.validatePassword(passwordInput.value);

                if (!passwordError) {
                  _context.next = 13;
                  break;
                }

                Swal.fire({
                  title: 'Format Password Salah',
                  text: passwordError,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return _context.abrupt("return");

              case 13:
                _context.prev = 13;
                Swal.fire({
                  title: 'Memproses',
                  text: 'Mohon tunggu...',
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  willOpen: function willOpen() {
                    Swal.showLoading();
                  }
                });
                _context.next = 17;
                return regeneratorRuntime.awrap(_authService["default"].resetPassword(namaInput.value.trim(), emailInput.value.trim(), passwordInput.value));

              case 17:
                response = _context.sent;

                if (!(response.status === 'success')) {
                  _context.next = 25;
                  break;
                }

                _context.next = 21;
                return regeneratorRuntime.awrap(Swal.fire({
                  title: 'Berhasil!',
                  text: 'Password berhasil diubah. Silakan login dengan password baru.',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }));

              case 21:
                form.reset();
                window.location.href = '/login';
                _context.next = 26;
                break;

              case 25:
                throw new Error(response.message || 'Data tidak ditemukan atau tidak sesuai');

              case 26:
                _context.next = 33;
                break;

              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](13);
                console.error('Reset Password Error:', _context.t0);
                _context.next = 33;
                return regeneratorRuntime.awrap(Swal.fire({
                  title: 'Gagal!',
                  text: _context.t0.message || 'Terjadi kesalahan, silakan coba lagi.',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                }));

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[13, 28]]);
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

  return FormResetPassword;
}(_wrapNativeSuper(HTMLElement));

customElements.define('form-reset-password', FormResetPassword);