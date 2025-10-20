const pool = require('../config/database');

const dbUtils = {
  async getNextAvailableId(tableName) {
    try {
      // Get the maximum ID from the table
      const maxIdQuery = `SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM ${tableName}`;
      const [maxResult] = await pool.execute(maxIdQuery);
      let nextId = maxResult[0].next_id;

      // Check if this ID exists (for gaps in sequence)
      const checkQuery = `SELECT id FROM ${tableName} WHERE id = ?`;
      const [checkResult] = await pool.execute(checkQuery, [nextId]);

      // If ID exists, find the first available ID
      if (checkResult.length > 0) {
        const findGapQuery = `
          SELECT t1.id + 1 AS next_id
          FROM ${tableName} t1
          LEFT JOIN ${tableName} t2 ON t1.id + 1 = t2.id
          WHERE t2.id IS NULL
          AND t1.id >= 1
          ORDER BY t1.id
          LIMIT 1
        `;
        const [gapResult] = await pool.execute(findGapQuery);
        if (gapResult.length > 0) {
          nextId = gapResult[0].next_id;
        }
      }

      return nextId;
    } catch (error) {
      console.error(`Error getting next available ID for ${tableName}:`, error);
      throw error;
    }
  }
};

module.exports = dbUtils;