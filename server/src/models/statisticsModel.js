const pool = require('../config/database');

const StatisticsModel = {
  async getReportStatistics() {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM riwayat_laporan) + 
          (SELECT COUNT(*) FROM laporan_masuk) as total,
          (SELECT COUNT(*) FROM riwayat_laporan) as completed,
          (SELECT COUNT(*) FROM laporan_masuk) as pending
      `;

      const [result] = await pool.execute(query);

      return {
        total: parseInt(result[0].total),
        completed: parseInt(result[0].completed),
        pending: parseInt(result[0].pending)
      };
    } catch (error) {
      console.error('Error in getReportStatistics:', error);
      throw error;
    }
  },

  async getReviews() {
    try {
      const query = `
        SELECT 
          r.rating,
          r.komentar as review_text,
          u.nama as user_name
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        JOIN riwayat_laporan rl ON r.laporan_id = rl.id 
        WHERE rl.status IN ('diterima', 'ditolak')
        ORDER BY r.created_at DESC 
        LIMIT 3
      `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getReviews:', error);
      throw error;
    }
  },

  async getUserStatistics(userId) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT lm.id) + COUNT(DISTINCT rl.id) as total_reports,
          COUNT(DISTINCT rl.id) as resolved,
          COUNT(DISTINCT lm.id) as in_progress
        FROM users u
        LEFT JOIN laporan_masuk lm ON u.id = lm.user_id
        LEFT JOIN riwayat_laporan rl ON u.id = rl.user_id
        WHERE u.id = ?
        GROUP BY u.id
      `;

      const [result] = await pool.execute(query, [userId]);

      if (result.length === 0) {
        return {
          totalReports: 0,
          resolved: 0,
          inProgress: 0
        };
      }

      return {
        totalReports: parseInt(result[0].total_reports) || 0,
        resolved: parseInt(result[0].resolved) || 0,
        inProgress: parseInt(result[0].in_progress) || 0
      };
    } catch (error) {
      console.error('Error in getUserStatistics:', error);
      throw error;
    }
  },
  async getDashboardStatistics() {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM laporan_masuk WHERE status = 'pending') as pending_count,
          (SELECT COUNT(*) FROM riwayat_laporan WHERE status = 'diterima') as accepted_count,
          (SELECT COUNT(*) FROM riwayat_laporan WHERE status = 'ditolak') as rejected_count,
          (
            (SELECT COUNT(*) FROM laporan_masuk) + 
            (SELECT COUNT(*) FROM riwayat_laporan)
          ) as total_count;
      `;

      const [result] = await pool.execute(query);
      return result[0];
    } catch (error) {
      console.error('Error in getDashboardStatistics:', error);
      throw error;
    }
  },

  async getMonthlyStatistics() {
    try {
      const query = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as accepted_count,
          SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as rejected_count
        FROM (
          SELECT created_at, NULL as status FROM laporan_masuk
          UNION ALL
          SELECT created_at, status FROM riwayat_laporan
        ) all_reports
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6;
      `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getMonthlyStatistics:', error);
      throw error;
    }
  },

  async getInfrastructureTypes() {
    try {
      const query = `
        SELECT 
          jenis_infrastruktur,
          COUNT(*) as count
        FROM (
          SELECT jenis_infrastruktur FROM laporan_masuk
          UNION ALL
          SELECT jenis_infrastruktur FROM riwayat_laporan
        ) all_types
        GROUP BY jenis_infrastruktur
        ORDER BY count DESC;
      `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getInfrastructureTypes:', error);
      throw error;
    }
  },

  async getRecentUsers() {
    try {
      const query = `
        SELECT 
          u.id,
          u.nama,
          u.email,
          u.created_at,
          COUNT(DISTINCT lm.id) + COUNT(DISTINCT rl.id) as total_reports
        FROM users u
        LEFT JOIN laporan_masuk lm ON u.id = lm.user_id
        LEFT JOIN riwayat_laporan rl ON u.id = rl.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT 10;
      `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getRecentUsers:', error);
      throw error;
    }
  },

  async getTodayReports() {
    try {
      const query = `
        SELECT 
          lm.id,
          lm.judul,
          lm.jenis_infrastruktur,
          lm.alamat_kejadian as alamat,
          lm.created_at,
          u.nama as pelapor
        FROM laporan_masuk lm
        JOIN users u ON lm.user_id = u.id
        WHERE DATE(lm.created_at) = CURDATE()
        ORDER BY lm.created_at DESC;
      `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getTodayReports:', error);
      throw error;
    }
  }
};

module.exports = StatisticsModel;