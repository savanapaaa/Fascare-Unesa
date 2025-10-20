"use strict";

// ❌ CONTOH KODE YANG SALAH - MENYEBABKAN INFINITE LOOP
// 1. setInterval tanpa clearInterval
var imageRefreshInterval;

function startImageRefresh() {
  imageRefreshInterval = setInterval(function () {
    console.log('Reloading image...');
    var img = document.querySelector('#myImage');

    if (img) {
      // Menambahkan timestamp untuk force reload - BERBAHAYA!
      img.src = '/images/placeholder.jpg?' + Date.now();
    }
  }, 100); // Setiap 100ms - SANGAT BERBAHAYA!
} // 2. Event listener yang terpicu berulang


document.addEventListener('DOMContentLoaded', function () {
  var images = document.querySelectorAll('img');
  images.forEach(function (img) {
    img.addEventListener('error', function () {
      console.log('Image failed, retrying...'); // ❌ SALAH: Retry tanpa delay atau limit

      this.src = '/images/placeholder.jpg?' + Math.random();
    });
  });
}); // 3. Promise chain yang infinite

function loadImageWithRetry(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      return resolve(url);
    };

    img.onerror = function () {
      // ❌ SALAH: Retry tanpa henti
      loadImageWithRetry(url).then(resolve)["catch"](reject);
    };

    img.src = url;
  });
} // 4. Observer yang terus menerus trigger


var observer = new MutationObserver(function () {
  var images = document.querySelectorAll('img:not([src])');
  images.forEach(function (img) {
    // ❌ SALAH: Set src berulang kali
    img.src = '/images/placeholder.jpg';
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src']
}); // 5. Hot reload development server yang salah konfigurasi

if (process.env.NODE_ENV === 'development') {
  // ❌ SALAH: Reload terlalu agresif
  setInterval(function () {
    if (document.hidden) return; // Force reload semua gambar

    document.querySelectorAll('img').forEach(function (img) {
      img.src = img.src.split('?')[0] + '?v=' + Date.now();
    });
  }, 1000);
}