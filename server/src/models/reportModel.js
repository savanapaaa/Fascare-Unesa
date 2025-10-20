const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');
const https = require('https');

const ReportModel = {
  geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      const encodedAddress = encodeURIComponent(address);
      const options = {
        hostname: 'nominatim.openstreetmap.org',
        path: `/search?format=json&q=${encodedAddress}&limit=1`,
        method: 'GET',
        headers: {
          'User-Agent': 'UrbanAID/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parseData = JSON.parse(data);
            if (parseData.length > 0) {
              resolve({
                latitude: parseFloat(parseData[0].lat),
                longitude: parseFloat(parseData[0].lon)
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  },

  async createReport(reportData) {
    const {
      judul,
      jenis_infrastruktur,
      tanggal_kejadian,
      deskripsi,
      alamat_kejadian,
      lampiran,
      user_id
    } = reportData;

    let latitude = null;
    let longitude = null;
    try {
      const geocodeResult = await this.geocodeAddress(alamat_kejadian);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    const query = `INSERT INTO laporan_masuk 
             (judul, jenis_infrastruktur, tanggal_kejadian, deskripsi, alamat_kejadian, lampiran, user_id, latitude, longitude) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [result] = await pool.execute(query, [
        judul,
        jenis_infrastruktur,
        tanggal_kejadian,
        deskripsi,
        alamat_kejadian,
        lampiran,
        user_id,
        latitude,
        longitude
      ]);
      
      // Get the created report
      const [rows] = await pool.execute('SELECT * FROM laporan_masuk WHERE id = ?', [result.insertId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateReport(reportData) {
    const {
      id,
      judul,
      jenis_infrastruktur,
      tanggal_kejadian,
      deskripsi,
      alamat,
      bukti_lampiran
    } = reportData;

    let latitude = null;
    let longitude = null;
    try {
      const geocodeResult = await this.geocodeAddress(alamat);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    const query = `UPDATE laporan_masuk 
                   SET judul = ?, 
                       jenis_infrastruktur = ?, 
                       tanggal_kejadian = ?, 
                       deskripsi = ?, 
                       alamat_kejadian = ?, 
                       lampiran = ?,
                       latitude = ?,
                       longitude = ? 
                   WHERE id = ?`;
    
    const values = [
      judul,
      jenis_infrastruktur,
      tanggal_kejadian,
      deskripsi,
      alamat,
      bukti_lampiran,
      latitude,
      longitude,
      id
    ];

    const [result] = await pool.execute(query, values);
    
    // Get the updated record
    const [selectResult] = await pool.execute('SELECT * FROM laporan_masuk WHERE id = ?', [id]);
    return selectResult[0];
  },

  async getReportsNearLocation(latitude, longitude, radius = 10) {
    const query = `
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + 
      sin(radians(?)) * sin(radians(latitude)))) AS distance 
      FROM laporan_masuk
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < ?
      ORDER BY distance
    `;
    
    const values = [latitude, longitude, latitude, radius];

    try {
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getIncomingReports() {
    try {
      const query = `
            SELECT 
                lm.id,
                lm.judul,
                lm.jenis_infrastruktur,
                lm.tanggal_kejadian,
                lm.deskripsi,
                lm.alamat_kejadian as alamat,
                lm.status,
                lm.created_at,
                u.nama as nama_pelapor
            FROM laporan_masuk lm
            JOIN users u ON lm.user_id = u.id
            WHERE lm.status = 'pending'
            ORDER BY lm.created_at DESC
        `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getIncomingReports:', error);
      throw error;
    }
  },

  async getReportDetail(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const query = `
          SELECT 
              lm.id,
              lm.judul,
              lm.jenis_infrastruktur,
              lm.tanggal_kejadian,
              lm.deskripsi,
              lm.alamat_kejadian as alamat,
              lm.lampiran as bukti_lampiran,
              lm.status,
              lm.created_at,
              lm.latitude,  
              lm.longitude,
              u.nama as nama_pelapor
          FROM laporan_masuk lm
          JOIN users u ON lm.user_id = u.id
          WHERE lm.id = ?
      `;

      const [result] = await pool.execute(query, [id]);
      if (result.length === 0) {
        throw new Error('Report not found');
      }
      return result[0];
    } catch (error) {
      console.error('Error in getReportDetail:', error);
      throw error;
    }
  },

  async getReportsByUserId(userId) {
    try {
      const query = `
            SELECT 
                lm.id,
                lm.judul,
                lm.jenis_infrastruktur,
                lm.tanggal_kejadian,
                lm.deskripsi,
                lm.alamat_kejadian as alamat,
                lm.lampiran as bukti_lampiran,
                lm.status,
                lm.created_at,
                lm.latitude,
                lm.longitude,
                u.nama as nama_pelapor
            FROM laporan_masuk lm
            JOIN users u ON lm.user_id = u.id
            WHERE lm.user_id = ? 
            ORDER BY lm.created_at DESC
        `;

      const [result] = await pool.execute(query, [userId]);
      return result;
    } catch (error) {
      console.error('Error in getReportsByUserId:', error);
      throw error;
    }
  },

  async deleteReport(id) {
    try {
      // First get the report before deleting
      const [selectResult] = await pool.execute('SELECT * FROM laporan_masuk WHERE id = ?', [id]);
      
      if (selectResult.length === 0) {
        throw new Error('Laporan tidak ditemukan');
      }

      const reportToDelete = selectResult[0];

      // Then delete the report
      const [deleteResult] = await pool.execute('DELETE FROM laporan_masuk WHERE id = ?', [id]);

      if (deleteResult.affectedRows === 0) {
        throw new Error('Laporan tidak ditemukan');
      }

      return reportToDelete;
    } catch (error) {
      throw error;
    }
  },

  async getAllReports() {
    try {
      const query = `
        SELECT 
            lm.id,
            lm.judul,
            lm.jenis_infrastruktur,
            lm.tanggal_kejadian,
            lm.deskripsi,
            lm.alamat_kejadian as alamat,
            lm.status,
            lm.created_at,
            u.nama as nama_pelapor
        FROM laporan_masuk lm
        JOIN users u ON lm.user_id = u.id
        ORDER BY lm.created_at DESC
    `;

      const [result] = await pool.execute(query);
      return result;
    } catch (error) {
      console.error('Error in getAllReports:', error);
      throw error;
    }
  }



};

module.exports = ReportModel;
