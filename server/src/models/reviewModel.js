const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

const reviewModel = {
  async createReview({ laporan_id, user_id, rating, review_text }) {
    try {
      const nextId = await dbUtils.getNextAvailableId('reviews');

      const query = `INSERT INTO reviews (id, laporan_id, user_id, rating, review_text) 
                     VALUES (?, ?, ?, ?, ?)`;
      const [result] = await pool.execute(query, [nextId, laporan_id, user_id, rating, review_text]);
      
      // Get the created review
      const [createdReview] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [nextId]);
      return createdReview[0];
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  },

  async getReviewByLaporanId(laporan_id) {
    try {
      const query = `SELECT r.*, u.nama as user_name 
                     FROM reviews r 
                     JOIN users u ON r.user_id = u.id 
                     WHERE r.laporan_id = ?`;
      const [result] = await pool.execute(query, [laporan_id]);
      return result;
    } catch (error) {
      console.error('Error in getReviewByLaporanId:', error);
      throw error;
    }
  },

  async checkExistingReview(laporan_id, user_id) {
    try {
      const query = 'SELECT * FROM reviews WHERE laporan_id = ? AND user_id = ?';
      const [result] = await pool.execute(query, [laporan_id, user_id]);
      return result[0];
    } catch (error) {
      console.error('Error in checkExistingReview:', error);
      throw error;
    }
  }
};

module.exports = reviewModel;