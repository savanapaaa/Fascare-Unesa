// Script untuk membersihkan cache browser
// Jalankan di Console Browser (F12)

async function clearAllCaches() {
    try {
        console.log('🧹 Membersihkan semua cache...');
        
        // 1. Clear Service Worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('📦 Cache yang ditemukan:', cacheNames);
            
            for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
                console.log(`✅ Cache dihapus: ${cacheName}`);
            }
        }
        
        // 2. Unregister Service Worker
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
                console.log('✅ Service Worker di-unregister');
            }
        }
        
        // 3. Clear Local Storage
        if (localStorage) {
            localStorage.clear();
            console.log('✅ Local Storage dibersihkan');
        }
        
        // 4. Clear Session Storage
        if (sessionStorage) {
            sessionStorage.clear();
            console.log('✅ Session Storage dibersihkan');
        }
        
        console.log('🎉 Semua cache berhasil dibersihkan!');
        console.log('🔄 Silakan refresh halaman untuk melihat perubahan');
        
    } catch (error) {
        console.error('❌ Error saat membersihkan cache:', error);
    }
}

// Jalankan fungsi
clearAllCaches();