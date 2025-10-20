const pool = require('../config/database');

const superAdminModel = {
  async getAllAdmins(page = 1, limit = 10, search = '') {
    try {
      let query = `
            SELECT id, nama, email, role, created_at 
            FROM admins 
            WHERE 1=1
            `;

      const values = [];

      if (search) {
        query += ' AND (nama LIKE ? OR email LIKE ?)';
        values.push(`%${search}%`, `%${search}%`);
      }

      const countQuery = `SELECT COUNT(*) as count FROM (${query}) as count_query`;
      const [countResult] = await pool.execute(countQuery, values);
      const total = parseInt(countResult[0].count);

      const offset = (page - 1) * limit;
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      values.push(limit, offset);

      const [result] = await pool.execute(query, values);

      return {
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error in getAllAdmins:', error);
      throw error;
    }
  },

  async getAdminById(id) {
    try {
      const query = `
                SELECT id, nama, email, role, created_at 
                FROM admins 
                WHERE id = ?
            `;
      const [result] = await pool.execute(query, [id]);
      return result[0];
    } catch (error) {
      console.error('Error in getAdminById:', error);
      throw error;
    }
  },

  async createAdmin(adminData) {
    const { nama, email, password, role = 'admin' } = adminData;

    try {
      const query = `
                INSERT INTO admins (nama, email, password, role)
                VALUES (?, ?, ?, ?)
            `;
      const [result] = await pool.execute(query, [nama, email, password, role]);
      
      // Get the created admin
      const [createdAdmin] = await pool.execute(
        'SELECT id, nama, email, role, created_at FROM admins WHERE id = ?',
        [result.insertId]
      );
      return createdAdmin[0];
    } catch (error) {
      console.error('Error in createAdmin:', error);
      throw error;
    }
  },

  async getUserAllReports(userId) {
    try {
      const activeLaporanQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    created_at,
                    'aktif' as jenis_laporan
                FROM laporan_masuk
                WHERE user_id = ?
            `;

      const riwayatLaporanQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    tanggal_selesai,
                    admin_response as keterangan_laporan,
                    created_at,
                    'riwayat' as jenis_laporan
                FROM riwayat_laporan
                WHERE user_id = ?
            `;

      const query = `
                (${activeLaporanQuery})
                UNION ALL
                (${riwayatLaporanQuery})
                ORDER BY created_at DESC
            `;

      const [result] = await pool.execute(query, [userId, userId]);
      return result;
    } catch (error) {
      console.error('Error in getUserAllReports:', error);
      throw error;
    }
  },

  async updateAdmin(id, adminData) {
    const { nama, email, password } = adminData;

    try {
      let query;
      let values;

      if (password) {
        query = `
                    UPDATE admins 
                    SET nama = ?, email = ?, password = ? 
                    WHERE id = ?
                `;
        values = [nama, email, password, id];
      } else {
        query = `
                    UPDATE admins 
                    SET nama = ?, email = ? 
                    WHERE id = ?
                `;
        values = [nama, email, id];
      }

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error('Admin not found');
      }

      // Get the updated admin
      const [updatedAdmin] = await pool.execute(
        'SELECT id, nama, email, role, created_at FROM admins WHERE id = ?',
        [id]
      );
      return updatedAdmin[0];
    } catch (error) {
      console.error('Error in updateAdmin:', error);
      throw error;
    }
  },

  async deleteAdmin(id) {
    try {
      const query = 'DELETE FROM admins WHERE id = ? AND role = ?';
      const [result] = await pool.execute(query, [id, 'admin']);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteAdmin:', error);
      throw error;
    }
  },

  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      let query = `
            SELECT id, nama, email, role, created_at 
            FROM users 
            WHERE 1=1
            `;

      const values = [];

      if (search) {
        query += ' AND (nama LIKE ? OR email LIKE ?)';
        values.push(`%${search}%`, `%${search}%`);
      }

      const countQuery = `SELECT COUNT(*) as count FROM (${query}) as count_query`;
      const [countResult] = await pool.execute(countQuery, values);
      const total = parseInt(countResult[0].count);

      const offset = (page - 1) * limit;
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      values.push(limit, offset);

      const [result] = await pool.execute(query, values);

      return {
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const query = `
                SELECT id, nama, email, role, created_at 
                FROM users 
                WHERE id = ?
            `;
      const [result] = await pool.execute(query, [id]);
      return result[0];
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  async getUserReports(userId) {
    try {
      // Get active reports
      const activeReportsQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    created_at,
                    'aktif' as jenis_laporan
                FROM laporan_masuk
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;

      // Get history reports
      const historyReportsQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    tanggal_selesai,
                    admin_response as keterangan_laporan,
                    created_at,
                    'riwayat' as jenis_laporan
                FROM riwayat_laporan
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;

      const [activeReports] = await pool.execute(activeReportsQuery, [userId]);
      const [historyReports] = await pool.execute(historyReportsQuery, [userId]);

      return {
        active: activeReports,
        history: historyReports,
        total: activeReports.length + historyReports.length
      };
    } catch (error) {
      console.error('Error in getUserReports:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    const { nama, email } = userData;

    try {
      const query = `
                UPDATE users 
                SET nama = ?, email = ? 
                WHERE id = ?
            `;
      const [result] = await pool.execute(query, [nama, email, id]);

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      // Get the updated user
      const [updatedUser] = await pool.execute(
        'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      return updatedUser[0];
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      // First, check if user exists and get their reports
      const [userCheck] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
      if (userCheck.length === 0) {
        throw new Error('User not found');
      }

      // Begin transaction to ensure data consistency
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Delete user's reviews first (due to foreign key constraint)
        await connection.execute('DELETE FROM reviews WHERE user_id = ?', [id]);
        
        // Move active reports to history before deleting user
        await connection.execute(`
          INSERT INTO riwayat_laporan 
          (judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, processed_at, alamat, status, admin_response, bukti_lampiran, user_id)
          SELECT judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, NOW(), alamat, 'cancelled', 'User account deleted', bukti_lampiran, user_id
          FROM laporan_masuk WHERE user_id = ?
        `, [id]);

        // Delete active reports
        await connection.execute('DELETE FROM laporan_masuk WHERE user_id = ?', [id]);
        
        // Finally delete the user
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);

        await connection.commit();
        connection.release();

        return result.affectedRows > 0;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },

  async getUserStatistics() {
    try {
      const query = `
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM admins WHERE role = 'admin') as total_admins,
                (SELECT COUNT(*) FROM laporan_masuk) as total_active_reports,
                (SELECT COUNT(*) FROM riwayat_laporan) as total_completed_reports,
                (SELECT COUNT(*) FROM laporan_masuk WHERE status = 'pending') as pending_reports,
                (SELECT COUNT(*) FROM laporan_masuk WHERE status = 'in_progress') as in_progress_reports,
                (SELECT COUNT(*) FROM reviews) as total_reviews
            `;
      const [result] = await pool.execute(query);
      return result[0];
    } catch (error) {
      console.error('Error in getUserStatistics:', error);
      throw error;
    }
  }
};

module.exports = superAdminModel;