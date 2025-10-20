/**
 * Image Handler untuk menangani loading gambar dengan fallback
 * Mencegah spam request dan menangani error dengan baik
 */
class ImageHandler {
  constructor() {
    this.loadedImages = new Map(); // Cache untuk gambar yang sudah berhasil dimuat
    this.failedImages = new Map(); // Map dengan timestamp untuk gambar yang gagal
    this.loadingImages = new Set(); // Set untuk gambar yang sedang dimuat
    this.placeholderUrl = '/images/placeholder.jpg'; // Default placeholder
    this.defaultPlaceholder = this.createDefaultPlaceholder();
    this.maxRetries = 1; // Batas maksimal retry (dikurangi untuk mencegah spam)
    this.retryDelay = 2000; // Delay antara retry (2 detik)
    this.failureExpiry = 10 * 60 * 1000; // 10 menit sebelum boleh retry lagi
    this.placeholderTested = false; // Flag untuk cek apakah placeholder.jpg tersedia
    this.placeholderAvailable = false; // Flag status placeholder.jpg
  }

  /**
   * Buat placeholder SVG default yang selalu tersedia
   */
  createDefaultPlaceholder() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <rect x="20" y="20" width="360" height="260" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
        <circle cx="200" cy="120" r="25" fill="#9ca3af"/>
        <path d="M185 120 L200 105 L215 120 Z" fill="#6b7280"/>
        <text x="200" y="180" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16" font-weight="500">
          Tidak Ada Gambar
        </text>
        <text x="200" y="205" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
          Gambar tidak tersedia
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Test apakah placeholder.jpg tersedia di server
   */
  async testPlaceholderAvailability() {
    if (this.placeholderTested) {
      return this.placeholderAvailable;
    }

    try {
      const response = await fetch(this.placeholderUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      this.placeholderAvailable = response.ok;
      this.placeholderTested = true;
      
      console.log(`📷 Placeholder test: ${this.placeholderUrl} ${this.placeholderAvailable ? '✅ Available' : '❌ Not found'}`);
      return this.placeholderAvailable;
    } catch (error) {
      this.placeholderAvailable = false;
      this.placeholderTested = true;
      console.log(`📷 Placeholder test failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Cek apakah gambar masih dalam periode gagal
   */
  isImageRecentlyFailed(imageUrl) {
    const failTime = this.failedImages.get(imageUrl);
    if (!failTime) return false;
    
    const now = Date.now();
    const timeSinceFailure = now - failTime;
    
    // Jika sudah lewat periode expiry, hapus dari failed list
    if (timeSinceFailure > this.failureExpiry) {
      this.failedImages.delete(imageUrl);
      return false;
    }
    
    return true;
  }

  /**
   * Cek apakah gambar sedang dalam proses loading
   */
  isImageLoading(imageUrl) {
    return this.loadingImages.has(imageUrl);
  }

  /**
   * Load gambar dengan fallback handling
   * @param {HTMLImageElement} imgElement - Element img yang akan diload
   * @param {string|null} imageUrl - URL gambar dari API
   * @param {Object} options - Opsi tambahan
   */
  async loadImage(imgElement, imageUrl, options = {}) {
    const {
      showStatus = false,
      statusElement = null,
      onLoading = null,
      onSuccess = null,
      onError = null,
      retryCount = 0
    } = options;

    // Reset classes
    imgElement.classList.remove('loading', 'error');
    
    // Jika URL kosong/null, langsung pakai placeholder
    if (!imageUrl || imageUrl.trim() === '') {
      console.log('📷 No image URL provided, using placeholder');
      this.setPlaceholderSafely(imgElement, statusElement, 'Tidak ada gambar');
      return;
    }

    // Jika gambar sedang loading, jangan load lagi
    if (this.isImageLoading(imageUrl)) {
      console.log('📷 Image already loading, skipping:', imageUrl);
      return;
    }

    // Jika gambar baru saja gagal, jangan retry terlalu cepat
    if (this.isImageRecentlyFailed(imageUrl)) {
      console.log('📷 Image recently failed, using placeholder:', imageUrl);
      this.setPlaceholderSafely(imgElement, statusElement, 'Gambar tidak tersedia');
      return;
    }

    // Jika gambar sudah ada di cache, gunakan cache
    if (this.loadedImages.has(imageUrl)) {
      console.log('📷 Using cached image:', imageUrl);
      imgElement.src = this.loadedImages.get(imageUrl);
      this.updateStatus(statusElement, 'Dimuat dari cache', 'status-success');
      onSuccess && onSuccess(imgElement);
      return;
    }

    // Tandai sebagai sedang loading
    this.loadingImages.add(imageUrl);

    // Mulai loading
    imgElement.classList.add('loading');
    this.updateStatus(statusElement, 'Memuat...', 'status-loading');
    onLoading && onLoading(imgElement);

    try {
      const loadedImageUrl = await this.loadImageAsync(imageUrl);
      
      // Remove dari loading set
      this.loadingImages.delete(imageUrl);
      
      // Sukses loading
      imgElement.classList.remove('loading');
      imgElement.src = loadedImageUrl;
      this.loadedImages.set(imageUrl, loadedImageUrl);
      
      // Remove dari failed images jika ada
      this.failedImages.delete(imageUrl);
      
      this.updateStatus(statusElement, 'Gambar dimuat', 'status-success');
      onSuccess && onSuccess(imgElement);
      
      console.log('✅ Image loaded successfully:', imageUrl);

    } catch (error) {
      // Remove dari loading set
      this.loadingImages.delete(imageUrl);
      
      console.warn('❌ Failed to load image:', imageUrl, error.message);
      
      // Retry dengan backoff jika belum mencapai max retry
      if (retryCount < this.maxRetries) {
        console.log(`🔄 Retrying image load (${retryCount + 1}/${this.maxRetries}):`, imageUrl);
        
        setTimeout(() => {
          this.loadImage(imgElement, imageUrl, {
            ...options,
            retryCount: retryCount + 1
          });
        }, this.retryDelay * (retryCount + 1)); // Exponential backoff
        
        return;
      }
      
      // Simpan waktu gagal dengan timestamp
      this.failedImages.set(imageUrl, Date.now());
      
      imgElement.classList.remove('loading');
      imgElement.classList.add('error');
      
      // Fallback ke placeholder
      this.setPlaceholderSafely(imgElement, statusElement, 'Gagal memuat gambar');
      onError && onError(imgElement, error);
    }
  }

  /**
   * Load gambar secara async dengan Promise
   */
  loadImageAsync(url) {
    return new Promise((resolve, reject) => {
      const testImg = new Image();
      
      testImg.onload = () => {
        resolve(url);
      };
      
      testImg.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // Set timeout untuk mencegah hanging request
      setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, 10000); // 10 detik timeout
      
      testImg.src = url;
    });
  }

  /**
   * Set placeholder image dengan perlindungan dari infinite loop
   */
  async setPlaceholderSafely(imgElement, statusElement, statusText) {
    try {
      // Test apakah placeholder.jpg tersedia
      const placeholderAvailable = await this.testPlaceholderAvailability();
      
      if (placeholderAvailable) {
        console.log('📷 Using server placeholder.jpg');
        imgElement.src = this.placeholderUrl;
        imgElement.onerror = () => {
          // Fallback jika placeholder.jpg gagal load
          console.log('📷 Server placeholder failed, using SVG fallback');
          imgElement.src = this.defaultPlaceholder;
          imgElement.onerror = null; // Prevent infinite loop
        };
      } else {
        console.log('📷 Using safe SVG placeholder');
        imgElement.src = this.defaultPlaceholder;
      }
      
      this.updateStatus(statusElement, statusText, 'status-placeholder');
    } catch (error) {
      console.log('📷 Error in setPlaceholderSafely, using SVG fallback:', error.message);
      imgElement.src = this.defaultPlaceholder;
      this.updateStatus(statusElement, statusText, 'status-placeholder');
    }
  }

  /**
   * Set placeholder image (legacy - kept for compatibility)
   */
  async setPlaceholder(imgElement, statusElement, statusText) {
    // Fallback to safe method to prevent infinite loops
    await this.setPlaceholderSafely(imgElement, statusElement, statusText);
  }

  /**
   * Update status indicator
   */
  updateStatus(statusElement, text, className) {
    if (statusElement) {
      statusElement.textContent = text;
      statusElement.className = `image-status ${className}`;
      statusElement.style.display = text ? 'block' : 'none';
    }
  }

  /**
   * Clear cache (untuk development/debugging)
   */
  clearCache() {
    this.loadedImages.clear();
    this.failedImages.clear();
    this.loadingImages.clear();
    console.log('🧹 Image cache cleared completely');
  }

  /**
   * Retry loading failed image
   */
  async retryImage(imgElement, imageUrl, options = {}) {
    this.failedImages.delete(imageUrl);
    this.loadingImages.delete(imageUrl);
    await this.loadImage(imgElement, imageUrl, { ...options, retryCount: 0 });
  }

  /**
   * Mendapatkan statistik cache untuk debugging
   */
  getCacheStats() {
    return {
      loadedImages: this.loadedImages.size,
      failedImages: this.failedImages.size,
      loadingImages: this.loadingImages.size,
      failedList: Array.from(this.failedImages.keys()),
      placeholderTested: this.placeholderTested,
      placeholderAvailable: this.placeholderAvailable
    };
  }

  /**
   * Tambahkan fallback otomatis ke img element
   * Fungsi ini menambahkan onerror handler yang otomatis mengganti ke placeholder
   */
  addImageFallback(imgElement, fallbackUrl = null) {
    // Jangan tambahkan fallback jika sudah ada
    if (imgElement.dataset.fallbackAdded === 'true') {
      return;
    }

    const originalSrc = imgElement.src;
    let fallbackUsed = false;

    imgElement.onerror = async () => {
      // Prevent infinite loop
      if (fallbackUsed) {
        console.log('📷 Fallback already used for:', originalSrc);
        return;
      }

      fallbackUsed = true;
      console.log('📷 Image failed, using fallback:', originalSrc);

      // Coba gunakan fallback URL yang diberikan, atau placeholder default
      if (fallbackUrl) {
        imgElement.src = fallbackUrl;
      } else {
        // Test placeholder availability dan gunakan yang terbaik
        const placeholderAvailable = await this.testPlaceholderAvailability();
        if (placeholderAvailable) {
          imgElement.src = this.placeholderUrl;
          // Jika placeholder.jpg juga gagal, gunakan SVG
          imgElement.onerror = () => {
            imgElement.src = this.defaultPlaceholder;
            imgElement.onerror = null;
          };
        } else {
          imgElement.src = this.defaultPlaceholder;
          imgElement.onerror = null;
        }
      }
    };

    imgElement.dataset.fallbackAdded = 'true';
  }

  /**
   * Setup fallback untuk semua img elements di halaman
   */
  setupGlobalImageFallback() {
    // Setup fallback untuk gambar yang sudah ada
    document.querySelectorAll('img').forEach(img => {
      this.addImageFallback(img);
    });

    // Setup observer untuk gambar yang ditambahkan secara dinamis
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
              this.addImageFallback(node);
            }
            // Juga cek img elements di dalam node yang ditambahkan
            node.querySelectorAll?.('img').forEach(img => {
              this.addImageFallback(img);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('📷 Global image fallback setup completed');
    return observer;
  }
}

// Global instance
window.imageHandler = new ImageHandler();

// Auto-load images dengan perlindungan dari multiple execution
let isAutoLoadExecuted = false;
document.addEventListener('DOMContentLoaded', () => {
  if (isAutoLoadExecuted) {
    console.log('📷 Auto-load already executed, skipping');
    return;
  }
  
  isAutoLoadExecuted = true;
  console.log('📷 Starting auto-load images and global fallback setup');
  
  // Setup global image fallback untuk semua img elements
  window.imageHandler.setupGlobalImageFallback();
  
  const images = document.querySelectorAll('img[data-src]');
  console.log(`📷 Found ${images.length} images to auto-load`);
  
  images.forEach((img, index) => {
    const imageUrl = img.dataset.src;
    const statusElement = document.querySelector(`#${img.id}Status`);
    
    // Tambahkan fallback sebelum load
    window.imageHandler.addImageFallback(img);
    
    // Tambahkan delay kecil antara loading gambar untuk mencegah race condition
    setTimeout(() => {
      window.imageHandler.loadImage(img, imageUrl, {
        showStatus: true,
        statusElement: statusElement
      });
    }, index * 50); // 50ms delay antara setiap gambar
  });
});

// Export fungsi utility untuk digunakan secara global
window.addImageFallback = (imgElement, fallbackUrl) => {
  if (window.imageHandler) {
    window.imageHandler.addImageFallback(imgElement, fallbackUrl);
  }
};

// Fungsi untuk menambah fallback ke gambar yang sudah ada
window.setupImageFallbacks = () => {
  if (window.imageHandler) {
    return window.imageHandler.setupGlobalImageFallback();
  }
};

console.log('📷 ImageHandler loaded with global fallback support');