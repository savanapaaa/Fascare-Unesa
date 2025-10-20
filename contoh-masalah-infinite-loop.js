// ❌ CONTOH KODE YANG SALAH - MENYEBABKAN INFINITE LOOP

// 1. setInterval tanpa clearInterval
let imageRefreshInterval;
function startImageRefresh() {
  imageRefreshInterval = setInterval(() => {
    console.log('Reloading image...');
    const img = document.querySelector('#myImage');
    if (img) {
      // Menambahkan timestamp untuk force reload - BERBAHAYA!
      img.src = '/images/placeholder.jpg?' + Date.now();
    }
  }, 100); // Setiap 100ms - SANGAT BERBAHAYA!
}

// 2. Event listener yang terpicu berulang
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      console.log('Image failed, retrying...');
      // ❌ SALAH: Retry tanpa delay atau limit
      this.src = '/images/placeholder.jpg?' + Math.random();
    });
  });
});

// 3. Promise chain yang infinite
function loadImageWithRetry(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => {
      // ❌ SALAH: Retry tanpa henti
      loadImageWithRetry(url).then(resolve).catch(reject);
    };
    img.src = url;
  });
}

// 4. Observer yang terus menerus trigger
const observer = new MutationObserver(() => {
  const images = document.querySelectorAll('img:not([src])');
  images.forEach(img => {
    // ❌ SALAH: Set src berulang kali
    img.src = '/images/placeholder.jpg';
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src']
});

// 5. Hot reload development server yang salah konfigurasi
if (process.env.NODE_ENV === 'development') {
  // ❌ SALAH: Reload terlalu agresif
  setInterval(() => {
    if (document.hidden) return;
    
    // Force reload semua gambar
    document.querySelectorAll('img').forEach(img => {
      img.src = img.src.split('?')[0] + '?v=' + Date.now();
    });
  }, 1000);
}