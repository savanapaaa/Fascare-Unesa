/**
 * Report Detail Page Handler
 * Menangani loading dan display detail laporan
 */
class ReportDetailPage {
  constructor() {
    this.reportId = this.getReportIdFromUrl();
    this.apiBaseUrl = 'http://localhost:3001/api'; // Sesuaikan dengan backend
    this.init();
  }

  /**
   * Extract report ID dari URL
   */
  getReportIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || window.location.pathname.split('/').pop();
  }

  /**
   * Initialize page
   */
  async init() {
    try {
      const reportData = await this.fetchReportDetail(this.reportId);
      this.displayReportDetail(reportData);
    } catch (error) {
      console.error('❌ Error loading report:', error);
      this.showError('Gagal memuat detail laporan');
    }
  }

  /**
   * Fetch report detail dari API
   */
  async fetchReportDetail(reportId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header jika diperlukan
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data; // Adjust sesuai struktur response backend
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  /**
   * Display report detail di UI
   */
  displayReportDetail(reportData) {
    // Update basic info
    document.getElementById('reportId').textContent = reportData.id || this.reportId;
    document.getElementById('reportTitle').textContent = reportData.judul || 'Tidak ada judul';
    document.getElementById('reportDescription').textContent = reportData.deskripsi || 'Tidak ada deskripsi';

    // Handle image loading
    this.loadReportImage(reportData);
  }

  /**
   * Load report image dengan proper fallback
   */
  loadReportImage(reportData) {
    const imgElement = document.getElementById('reportImage');
    const statusElement = document.getElementById('imageStatus');
    
    // Tentukan URL gambar
    let imageUrl = null;
    
    // Cek berbagai kemungkinan field nama untuk gambar
    if (reportData.url_gambar) {
      imageUrl = reportData.url_gambar;
    } else if (reportData.image_url) {
      imageUrl = reportData.image_url;
    } else if (reportData.gambar) {
      imageUrl = reportData.gambar;
    } else if (reportData.foto) {
      imageUrl = reportData.foto;
    }

    // Jika URL relatif, buat absolute URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Untuk development: http://localhost:3001
      // Untuk production: sesuaikan dengan domain backend
      imageUrl = `${this.apiBaseUrl.replace('/api', '')}${imageUrl}`;
    }

    console.log('📷 Loading report image:', imageUrl || 'No image URL');

    // Load image menggunakan ImageHandler
    window.imageHandler.loadImage(imgElement, imageUrl, {
      showStatus: true,
      statusElement: statusElement,
      
      onLoading: (img) => {
        console.log('📷 Starting to load image...');
      },
      
      onSuccess: (img) => {
        console.log('✅ Report image loaded successfully');
        // Hide status setelah 3 detik jika sukses
        setTimeout(() => {
          if (statusElement) statusElement.style.display = 'none';
        }, 3000);
      },
      
      onError: (img, error) => {
        console.warn('❌ Report image failed to load:', error.message);
        // Bisa add analytics/logging untuk track image failures
        this.trackImageError(imageUrl, error);
      }
    });
  }

  /**
   * Track image loading errors untuk analytics
   */
  trackImageError(imageUrl, error) {
    // Send ke analytics service jika ada
    console.log('📊 Tracking image error:', {
      reportId: this.reportId,
      imageUrl: imageUrl,
      error: error.message,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Show error message
   */
  showError(message) {
    const container = document.querySelector('.report-container');
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h2 style="color: #ef4444;">⚠️ Error</h2>
        <p>${message}</p>
        <button onclick="window.location.reload()" style="
          background: #3b82f6; 
          color: white; 
          padding: 8px 16px; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer;
        ">
          Coba Lagi
        </button>
      </div>
    `;
  }

  /**
   * Retry loading image
   */
  retryImage() {
    const imgElement = document.getElementById('reportImage');
    const currentSrc = imgElement.src;
    
    if (currentSrc && currentSrc !== window.imageHandler.defaultPlaceholder) {
      window.imageHandler.retryImage(imgElement, currentSrc, {
        showStatus: true,
        statusElement: document.getElementById('imageStatus')
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.reportDetailPage = new ReportDetailPage();
});

// Add retry button functionality
document.addEventListener('click', (e) => {
  if (e.target.matches('.retry-image-btn')) {
    window.reportDetailPage.retryImage();
  }
});