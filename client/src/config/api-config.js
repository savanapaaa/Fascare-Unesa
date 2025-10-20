// API Configuration for FasCare
const API_CONFIG = {
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
};

// Auto detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('local');

const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export const BASE_URL = currentConfig.BASE_URL;
export const CLIENT_URL = currentConfig.CLIENT_URL;

// Export for legacy usage
window.API_BASE_URL = BASE_URL;
window.CLIENT_BASE_URL = CLIENT_URL;

console.log(`Environment: ${isDevelopment ? 'Development' : 'Production'}`);
console.log(`API Base URL: ${BASE_URL}`);