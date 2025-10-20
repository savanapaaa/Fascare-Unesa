/**
 * Image Handler DIPERBAIKI - Mencegah spam request dan infinite loop
 */
class ImageHandler {
  constructor() {
    this.loadedImages = new Map(); // Cache untuk gambar yang sudah berhasil dimuat
    this.failedImages = new Map(); // Map dengan timestamp untuk gambar yang gagal
    this.loadingImages = new Set(); // Set untuk gambar yang sedang dimuat
    this.placeholderUrl = '/images/placeholder.jpg';
    this.defaultPlaceholder = this.createDefaultPlaceholder();
    this.retryCount = 0;
    this.maxRetries = 2; // ✅ Batas maksimal retry
    this.retryDelay = 1000; // ✅ Delay antara retry (1 detik)
    this.failureExpiry = 5 * 60 * 1000; // ✅ 5 menit sebelum boleh retry lagi
  }

  /**
   * Buat placeholder SVG default jika file placeholder.jpg tidak ada
   */
  createDefaultPlaceholder() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="140" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="16">
          Tidak Ada Gambar
        </text>
        <text x="200" y="160" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">
          Gambar tidak tersedia
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * ✅ Cek apakah gambar masih dalam periode gagal
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
   * ✅ Cek apakah gambar sedang dalam proses loading
   */
  isImageLoading(imageUrl) {
    return this.loadingImages.has(imageUrl);
  }

  /**
   * Load gambar dengan fallback handling yang AMAN
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
    
    // ✅ Jika URL kosong/null, langsung pakai placeholder
    if (!imageUrl || imageUrl.trim() === '') {
      console.log('📷 No image URL provided, using placeholder');
      this.setPlaceholderSafely(imgElement, statusElement, 'Tidak ada gambar');
      return;
    }

    // ✅ Jika gambar sedang loading, jangan load lagi
    if (this.isImageLoading(imageUrl)) {
      console.log('📷 Image already loading, skipping:', imageUrl);
      return;
    }

    // ✅ Jika gambar baru saja gagal, jangan retry terlalu cepat
    if (this.isImageRecentlyFailed(imageUrl)) {
      console.log('📷 Image recently failed, using placeholder:', imageUrl);
      this.setPlaceholderSafely(imgElement, statusElement, 'Gambar tidak tersedia');
      return;
    }

    // ✅ Jika gambar sudah ada di cache, gunakan cache
    if (this.loadedImages.has(imageUrl)) {
      console.log('📷 Using cached image:', imageUrl);
      imgElement.src = this.loadedImages.get(imageUrl);
      this.updateStatus(statusElement, 'Dimuat dari cache', 'status-success');
      onSuccess && onSuccess(imgElement);
      return;
    }

    // ✅ Tandai sebagai sedang loading
    this.loadingImages.add(imageUrl);

    // Mulai loading
    imgElement.classList.add('loading');
    this.updateStatus(statusElement, 'Memuat...', 'status-loading');
    onLoading && onLoading(imgElement);

    try {
      const loadedImageUrl = await this.loadImageAsync(imageUrl);
      
      // ✅ Remove dari loading set
      this.loadingImages.delete(imageUrl);
      
      // Sukses loading
      imgElement.classList.remove('loading');
      imgElement.src = loadedImageUrl;
      this.loadedImages.set(imageUrl, loadedImageUrl);
      
      // ✅ Remove dari failed images jika ada
      this.failedImages.delete(imageUrl);
      
      this.updateStatus(statusElement, 'Gambar dimuat', 'status-success');
      onSuccess && onSuccess(imgElement);
      
      console.log('✅ Image loaded successfully:', imageUrl);

    } catch (error) {
      // ✅ Remove dari loading set
      this.loadingImages.delete(imageUrl);
      
      console.warn('❌ Failed to load image:', imageUrl, error.message);
      
      // ✅ Retry dengan backoff jika belum mencapai max retry
      if (retryCount < this.maxRetries) {
        console.log(`🔄 Retrying image load (${retryCount + 1}/${this.maxRetries}):`, imageUrl);
        
        setTimeout(() => {
          this.loadImage(imgElement, imageUrl, {
            ...options,
            retryCount: retryCount + 1
          });
        }, this.retryDelay * (retryCount + 1)); // ✅ Exponential backoff
        
        return;
      }
      
      // ✅ Simpan waktu gagal dengan timestamp
      this.failedImages.set(imageUrl, Date.now());
      
      imgElement.classList.remove('loading');
      imgElement.classList.add('error');
      
      // Fallback ke placeholder
      this.setPlaceholderSafely(imgElement, statusElement, 'Gagal memuat gambar');
      onError && onError(imgElement, error);
    }
  }

  /**
   * ✅ Load gambar secara async dengan timeout yang lebih ketat
   */
  loadImageAsync(url) {
    return new Promise((resolve, reject) => {
      const testImg = new Image();
      
      // ✅ Set timeout lebih ketat
      const timeoutId = setTimeout(() => {
        testImg.onload = null;
        testImg.onerror = null;
        reject(new Error(`Image load timeout: ${url}`));
      }, 5000); // 5 detik timeout
      
      testImg.onload = () => {
        clearTimeout(timeoutId);
        resolve(url);
      };
      
      testImg.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      testImg.src = url;
    });
  }

  /**
   * ✅ Set placeholder dengan perlindungan dari infinite loop
   */
  setPlaceholderSafely(imgElement, statusElement, statusText) {
    // ✅ TIDAK mencoba load placeholder.jpg lagi
    // Langsung gunakan SVG default untuk menghindari loop
    console.log('📷 Using safe SVG placeholder');
    imgElement.src = this.defaultPlaceholder;
    this.updateStatus(statusElement, statusText, 'status-placeholder');
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
   * ✅ Clear cache dengan pembersihan yang lebih menyeluruh
   */
  clearCache() {
    this.loadedImages.clear();
    this.failedImages.clear();
    this.loadingImages.clear();
    console.log('🧹 Image cache cleared completely');
  }

  /**
   * ✅ Retry loading failed image dengan reset failure timestamp
   */
  async retryImage(imgElement, imageUrl, options = {}) {
    this.failedImages.delete(imageUrl);
    this.loadingImages.delete(imageUrl);
    await this.loadImage(imgElement, imageUrl, { ...options, retryCount: 0 });
  }

  /**
   * ✅ Mendapatkan statistik cache untuk debugging
   */
  getCacheStats() {
    return {
      loadedImages: this.loadedImages.size,
      failedImages: this.failedImages.size,
      loadingImages: this.loadingImages.size,
      failedList: Array.from(this.failedImages.keys())
    };
  }
}

// Global instance
window.imageHandler = new ImageHandler();

// ✅ Auto-load images dengan perlindungan dari multiple execution
let isAutoLoadExecuted = false;
document.addEventListener('DOMContentLoaded', () => {
  if (isAutoLoadExecuted) {
    console.log('📷 Auto-load already executed, skipping');
    return;
  }
  
  isAutoLoadExecuted = true;
  console.log('📷 Starting auto-load images');
  
  const images = document.querySelectorAll('img[data-src]');
  console.log(`📷 Found ${images.length} images to auto-load`);
  
  images.forEach((img, index) => {
    const imageUrl = img.dataset.src;
    const statusElement = document.querySelector(`#${img.id}Status`);
    
    // ✅ Tambahkan delay kecil antara loading gambar untuk mencegah race condition
    setTimeout(() => {
      window.imageHandler.loadImage(img, imageUrl, {
        showStatus: true,
        statusElement: statusElement
      });
    }, index * 50); // 50ms delay antara setiap gambar
  });
});