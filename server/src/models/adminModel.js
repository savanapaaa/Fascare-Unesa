const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

class AdminModel {
  static async findByEmail(email) {
    try {
      console.log('Finding admin by email:', email);
      const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
      console.log('Admin found:', rows.length > 0);
      return rows[0];
    } catch (err) {
      console.error('Error finding admin by email:', err);
      throw err;
    }
  }

  static async updateLastLogin(id) {
    // Note: last_login column does not exist in current schema
    // Return the admin record without updating last_login
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM admins WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async create({ nama, email, password, role }) {
    const query = `
      INSERT INTO admins (nama, email, password, role)
      VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nama, email, password, role]);
    
    // Get the created admin
    const [rows] = await pool.execute('SELECT id, nama, email, role FROM admins WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async getAllAdmins() {
    const query = 'SELECT id, nama, email, role, created_at FROM admins WHERE role = ?';
    const [rows] = await pool.execute(query, ['admin']);
    return rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM admins WHERE id = ? AND role = ?';
    const [result] = await pool.execute(query, [id, 'admin']);
    return result.affectedRows > 0;
  }

  static async update(id, { nama, email, password }) {
    try {
      let query;
      let params;

      if (!email) {
        throw new Error('Email is required');
      }

      console.log('Updating admin with data:', { nama, email, hasPassword: !!password });

      if (password) {
        query = `
          UPDATE admins 
          SET nama = ?, email = ?, password = ?
          WHERE id = ?`;
        params = [nama, email, password, id];
      } else {
        query = `
          UPDATE admins 
          SET nama = ?, email = ?
          WHERE id = ?`;
        params = [nama, email, id];
      }

      const [result] = await pool.execute(query, params);

      if (result.affectedRows === 0) {
        throw new Error('Admin not found');
      }

      // Get the updated admin
      const [rows] = await pool.execute('SELECT id, nama, email, role FROM admins WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in AdminModel.update:', error);
      throw error;
    }
  }


}

module.exports = AdminModel;