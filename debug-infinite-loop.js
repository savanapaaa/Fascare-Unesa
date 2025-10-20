// ✅ CONTOH DEBUGGING DAN TESTING UNTUK MASALAH INFINITE LOOP

// 1. Function untuk monitor request ke server
function monitorImageRequests() {
  const originalFetch = window.fetch;
  const requestLog = [];
  
  window.fetch = function(...args) {
    const url = args[0];
    const timestamp = new Date().toISOString();
    
    // Log jika request ke gambar
    if (url && typeof url === 'string' && url.includes('.jpg')) {
      requestLog.push({
        url,
        timestamp,
        stackTrace: new Error().stack
      });
      
      console.warn(`🚨 Image request detected: ${url} at ${timestamp}`);
      
      // Alert jika ada request spam (lebih dari 5 dalam 1 detik)
      const recentRequests = requestLog.filter(req => 
        req.url === url && 
        Date.now() - new Date(req.timestamp).getTime() < 1000
      );
      
      if (recentRequests.length > 5) {
        console.error('🚨 SPAM REQUEST DETECTED!', {
          url,
          count: recentRequests.length,
          recent: recentRequests
        });
        
        // Tampilkan alert
        alert(`SPAM REQUEST DETECTED!\nURL: ${url}\nCount: ${recentRequests.length} requests in 1 second`);
      }
    }
    
    return originalFetch.apply(this, args);
  };
  
  // Function untuk melihat log
  window.getImageRequestLog = () => requestLog;
  window.clearImageRequestLog = () => requestLog.length = 0;
}

// 2. Function untuk debugging image handler
function debugImageHandler() {
  if (!window.imageHandler) {
    console.error('ImageHandler not found!');
    return;
  }
  
  console.log('🔍 ImageHandler Debug Info:');
  console.log('Cache Stats:', window.imageHandler.getCacheStats());
  
  // Override console.log untuk track calls
  const originalLog = console.log;
  let imageHandlerCalls = 0;
  
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('📷')) {
      imageHandlerCalls++;
      if (imageHandlerCalls > 50) {
        console.error('🚨 Too many image handler calls! Possible infinite loop!');
        debugger; // Break di debugger
      }
    }
    return originalLog.apply(this, args);
  };
}

// 3. Function untuk test manual
function testImageLoading() {
  console.log('🧪 Testing image loading...');
  
  // Create test image element
  const testImg = document.createElement('img');
  testImg.id = 'test-image';
  testImg.style.display = 'none';
  document.body.appendChild(testImg);
  
  // Test dengan URL yang tidak ada
  console.log('Testing with non-existent URL...');
  window.imageHandler.loadImage(testImg, '/images/does-not-exist.jpg', {
    onLoading: () => console.log('Loading started'),
    onSuccess: () => console.log('Loading success'),
    onError: (img, error) => console.log('Loading error:', error.message)
  });
  
  // Test dengan placeholder.jpg
  setTimeout(() => {
    console.log('Testing with placeholder.jpg...');
    window.imageHandler.loadImage(testImg, '/images/placeholder.jpg', {
      onLoading: () => console.log('Placeholder loading started'),
      onSuccess: () => console.log('Placeholder loading success'),
      onError: (img, error) => console.log('Placeholder loading error:', error.message)
    });
  }, 2000);
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(testImg);
    console.log('Test completed and cleaned up');
  }, 5000);
}

// 4. Function untuk disable semua auto-reload
function disableAllAutoReload() {
  console.log('🛑 Disabling all auto-reload mechanisms...');
  
  // Disable setInterval yang mungkin ada
  const originalSetInterval = window.setInterval;
  window.setInterval = function(callback, delay) {
    console.warn('setInterval blocked:', callback.toString().substring(0, 100));
    return null; // Don't actually set the interval
  };
  
  // Disable setTimeout yang mencurigakan
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(callback, delay) {
    const callbackString = callback.toString();
    if (callbackString.includes('reload') || callbackString.includes('refresh') || callbackString.includes('location')) {
      console.warn('Suspicious setTimeout blocked:', callbackString.substring(0, 100));
      return null;
    }
    return originalSetTimeout.apply(this, arguments);
  };
  
  // Disable event listeners yang mencurigakan
  const originalAddEventListener = document.addEventListener;
  document.addEventListener = function(event, handler, options) {
    if (event === 'beforeunload' || event === 'unload') {
      console.warn('Unload event listener blocked');
      return;
    }
    return originalAddEventListener.apply(this, arguments);
  };
  
  console.log('✅ Auto-reload mechanisms disabled');
}

// 5. Function untuk check file placeholder.jpg exists
async function checkPlaceholderExists() {
  console.log('🔍 Checking if placeholder.jpg exists...');
  
  try {
    const response = await fetch('/images/placeholder.jpg', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      console.log('✅ placeholder.jpg exists');
      return true;
    } else {
      console.log('❌ placeholder.jpg not found (HTTP ' + response.status + ')');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking placeholder.jpg:', error.message);
    return false;
  }
}

// 6. Function untuk run all debugging
async function runFullDebug() {
  console.log('🚀 Starting full debug session...');
  
  monitorImageRequests();
  debugImageHandler();
  
  const placeholderExists = await checkPlaceholderExists();
  if (!placeholderExists) {
    console.warn('⚠️ placeholder.jpg not found - this might be causing the spam requests!');
  }
  
  console.log('🎯 Debug session started. Run these commands:');
  console.log('- testImageLoading() - Test image loading');
  console.log('- disableAllAutoReload() - Disable auto-reload');
  console.log('- getImageRequestLog() - View request log');
  console.log('- window.imageHandler.getCacheStats() - View cache stats');
  console.log('- window.imageHandler.clearCache() - Clear cache');
}

// Auto-run debug jika di development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode detected, auto-running debug...');
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runFullDebug, 1000);
  });
}

// Export functions ke global scope
window.monitorImageRequests = monitorImageRequests;
window.debugImageHandler = debugImageHandler;
window.testImageLoading = testImageLoading;
window.disableAllAutoReload = disableAllAutoReload;
window.checkPlaceholderExists = checkPlaceholderExists;
window.runFullDebug = runFullDebug;