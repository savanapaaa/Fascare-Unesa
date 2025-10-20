/**
 * Service Worker Registration dengan Best Practices
 * Menangani registration, update, dan error handling
 */

const swRegister = async () => {
  // Check browser support
  if (!('serviceWorker' in navigator)) {
    console.warn('🚫 Service Worker tidak didukung di browser ini');
    return null;
  }

  try {
    console.log('🔄 Mendaftarkan Service Worker...');
    
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none' // Selalu check update
    });

    console.log('✅ Service Worker berhasil didaftarkan:', {
      scope: registration.scope,
      installing: !!registration.installing,
      waiting: !!registration.waiting,
      active: !!registration.active
    });

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      console.log('🔄 Update Service Worker ditemukan...');
      
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        console.log(`📱 Service Worker state: ${newWorker.state}`);
        
        switch (newWorker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // Ada SW lama yang aktif, ada update tersedia
            console.log('⚡ Konten baru tersedia! Refresh halaman untuk update.');
            
            // Optional: Tampilkan notifikasi update ke user
            showUpdateNotification(registration);
          } else {
            // Pertama kali install
            console.log('✨ Konten sudah di-cache untuk offline.');
          }
          break;
          
        case 'redundant':
          console.log('❌ Service Worker menjadi redundant');
          break;
        }
      });
    });

    // Handle controller change (when new SW takes control)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller berubah');
      
      // ✅ DISABLE auto reload untuk mencegah refresh loop
      // Biarkan user manual refresh jika diperlukan
      console.log('ℹ️ Refresh halaman untuk menggunakan versi terbaru');
      
      // ❌ DISABLED: Prevent refresh loop
      // if (!window.location.href.includes('no-reload')) {
      //   console.log('🔄 Memuat ulang halaman untuk menggunakan versi terbaru...');
      //   window.location.reload();
      // }
    });

    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('📨 Pesan dari Service Worker:', event.data);
      
      if (event.data && event.data.type === 'SKIP_WAITING') {
        // SW siap untuk mengambil kontrol
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      }
    });

    // Check for updates immediately
    registration.update().catch((error) => {
      console.warn('⚠️ Gagal check update SW:', error);
    });

    return registration;

  } catch (error) {
    console.error('❌ Service Worker registration gagal:', error);
    
    // Fallback: coba register ulang dengan konfigurasi minimal
    try {
      console.log('🔄 Mencoba fallback registration...');
      const fallbackRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Fallback registration berhasil:', fallbackRegistration.scope);
      return fallbackRegistration;
    } catch (fallbackError) {
      console.error('❌ Fallback registration juga gagal:', fallbackError);
      return null;
    }
  }
};

/**
 * Tampilkan notifikasi update ke user (optional)
 */
const showUpdateNotification = (registration) => {
  // Anda bisa customize ini sesuai UI framework yang digunakan
  if (window.confirm('Ada update tersedia! Muat ulang halaman sekarang?')) {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }
};

/**
 * Unregister semua service workers (untuk development/debugging)
 */
export const unregisterSW = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      const result = await registration.unregister();
      console.log('🗑️ Service Worker unregistered:', result);
    }
    
    console.log('✅ Semua Service Worker sudah di-unregister');
  }
};

/**
 * Check apakah ada Service Worker yang aktif
 */
export const checkSWStatus = () => {
  if ('serviceWorker' in navigator) {
    return {
      supported: true,
      controller: !!navigator.serviceWorker.controller,
      ready: navigator.serviceWorker.ready
    };
  }
  
  return { supported: false };
};

// Default export
export default swRegister;