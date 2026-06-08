import pool from '../config/database.js';

export class Transaction {
  static async create(transactionData) {
    const { userId, amount, currency, swiftCode, beneficiaryAccount, beneficiaryName, status = 'pending' } = transactionData;
    const [result] = await pool.execute(
      `INSERT INTO transactions 
       (user_id, amount, currency, swift_code, beneficiary_account, beneficiary_name, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, amount, currency, swiftCode, beneficiaryAccount, beneficiaryName, status]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async findPending() {
    const [rows] = await pool.execute(
      "SELECT t.*, u.username, u.full_name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.status = 'pending' ORDER BY t.created_at ASC"
    );
    return rows;
  }

  static async updateStatus(transactionId, status, verifiedBy) {
    await pool.execute(
      'UPDATE transactions SET status = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      [status, verifiedBy, transactionId]
    );
  }

  static async findByPublicLookup(query) {
    const like = `%${query.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
    const [rows] = await pool.execute(
      `SELECT t.*, u.username, u.full_name
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE u.username LIKE ? OR u.full_name LIKE ?
       ORDER BY t.created_at DESC
       LIMIT 50`,
      [like, like]
    );
    return rows;
  }
}
