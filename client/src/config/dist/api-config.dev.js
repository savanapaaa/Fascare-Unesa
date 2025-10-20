"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLIENT_URL = exports.BASE_URL = void 0;
// API Configuration for FasCare
var API_CONFIG = {
  // Development configuration
  development: {
    BASE_URL: 'http://localhost:3001/api',
    CLIENT_URL: 'http://localhost:9000'
  },
  // Production configuration  
  production: {
    BASE_URL: 'https://urbanaid-server.up.railway.app/api',
    CLIENT_URL: 'https://urbanaid-client.vercel.app'
  }
}; // Auto detect environment

var isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('local');
var currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;
var BASE_URL = currentConfig.BASE_URL;
exports.BASE_URL = BASE_URL;
var CLIENT_URL = currentConfig.CLIENT_URL; // Export for legacy usage

exports.CLIENT_URL = CLIENT_URL;
window.API_BASE_URL = BASE_URL;
window.CLIENT_BASE_URL = CLIENT_URL;
console.log("Environment: ".concat(isDevelopment ? 'Development' : 'Production'));
console.log("API Base URL: ".concat(BASE_URL));