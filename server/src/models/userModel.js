const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

class UserModel {
  static async findByEmail(email) {
    try {
      console.log('Finding user by email:', email);
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      console.log('User found:', rows.length > 0);
      return rows[0];
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async create({ nama, email, password }) {
    const query = `
      INSERT INTO users (nama, email, password, role)
      VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nama, email, password, 'user']);
    
    // Get the created user
    const [rows] = await pool.execute('SELECT id, nama, email, role FROM users WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async getAllUsers() {
    const query = 'SELECT id, nama, email, role, created_at FROM users WHERE role = ?';
    const [rows] = await pool.execute(query, ['user']);
    return rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ? AND role = ?';
    const [result] = await pool.execute(query, [id, 'user']);
    return result.affectedRows > 0;
  }

  static async update(id, { nama, email }) {
    const query = `
      UPDATE users 
      SET nama = ?, email = ?
      WHERE id = ? AND role = ?`;
    const [result] = await pool.execute(query, [nama, email, id, 'user']);
    
    if (result.affectedRows > 0) {
      const [rows] = await pool.execute('SELECT id, nama, email, role FROM users WHERE id = ?', [id]);
      return rows[0];
    }
    return null;
  }

  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = ?
      WHERE id = ? AND role = ?`;
    const [result] = await pool.execute(query, [hashedPassword, id, 'user']);
    
    if (result.affectedRows > 0) {
      const [rows] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
      return rows[0];
    }
    return null;
  }
}

module.exports = UserModel;