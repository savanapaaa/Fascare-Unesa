const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

const RiwayatModel = {
  async getRiwayatByUserId(userId) {
    const query = `SELECT * FROM riwayat_laporan 
                   WHERE user_id = ? 
                   ORDER BY created_at DESC`;

    try {
      const [result] = await pool.execute(query, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createRiwayat(data) {
    const nextId = await dbUtils.getNextAvailableId('riwayat_laporan');
    const { judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id } = data;

    const query = `INSERT INTO riwayat_laporan 
                 (id, judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [result] = await pool.execute(query, [nextId, judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id]);
      
      // Get the inserted record
      const [newRecord] = await pool.execute('SELECT * FROM riwayat_laporan WHERE id = ?', [nextId]);
      return newRecord[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllRiwayat() {
    try {
      const [result] = await pool.execute('SELECT * FROM riwayat_laporan ORDER BY created_at DESC');
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getRiwayatById(id) {
    const query = 'SELECT * FROM riwayat_laporan WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [id]);
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  transferToRiwayat: async function (reportId, status, keterangan) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const getLaporanQuery = 'SELECT * FROM laporan_masuk WHERE id = ?';
      const [laporanResult] = await connection.execute(getLaporanQuery, [reportId]);
      const laporan = laporanResult[0];

      if (!laporan) {
        throw new Error('Laporan tidak ditemukan');
      }

      const nextRiwayatId = await dbUtils.getNextAvailableId('riwayat_laporan');

      const insertRiwayatQuery = `INSERT INTO riwayat_laporan (
                    id, judul, jenis_infrastruktur, deskripsi, 
                    tanggal_kejadian, alamat_kejadian, 
                    status, admin_response, lampiran, 
                    user_id, latitude, longitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [riwayatResult] = await connection.execute(insertRiwayatQuery, [
        nextRiwayatId,
        laporan.judul,
        laporan.jenis_infrastruktur,
        laporan.deskripsi,
        laporan.tanggal_kejadian,
        laporan.alamat_kejadian,
        status,
        keterangan,
        laporan.lampiran,
        laporan.user_id,
        laporan.latitude,
        laporan.longitude
      ]);

      const deleteLaporanQuery = 'DELETE FROM laporan_masuk WHERE id = ?';
      await connection.execute(deleteLaporanQuery, [reportId]);

      await connection.commit();
      
      // Get the inserted record
      const [newRiwayat] = await connection.execute('SELECT * FROM riwayat_laporan WHERE id = ?', [nextRiwayatId]);
      return newRiwayat[0];

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getRiwayatWithUserDetails: async function (id) {
    const query = `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                WHERE r.id = ?
            `;

    try {
      const [result] = await pool.execute(query, [id]);
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  getLatestRiwayat: async function (limit = 5) {
    const query = `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.processed_at DESC
                LIMIT ?
            `;

    try {
      const [result] = await pool.execute(query, [limit]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  getAllRiwayatWithUserDetails: async function () {
    const query = `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            `;

    try {
      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getDetailRiwayatWithUser: async function (id) {
    const query = `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                WHERE r.id = ?
            `;

    try {
      const [result] = await pool.execute(query, [id]);
      if (result.length === 0) {
        throw new Error('Riwayat tidak ditemukan');
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  }

};

module.exports = RiwayatModel;