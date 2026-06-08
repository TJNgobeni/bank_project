import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import { securityConfig } from '../config/security.js';

export class User {
  static async hashPassword(password) {
    return await bcrypt.hash(password, securityConfig.bcrypt.saltRounds);
  }

  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static async create(userData) {
    const { username, fullName, idNumber, accountNumber, password, role = 'customer' } = userData;
    const hashedPassword = await this.hashPassword(password);
    const [result] = await pool.execute(
      `INSERT INTO users (username, full_name, id_number, account_number, password_hash, role, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [username, fullName, idNumber, accountNumber, hashedPassword, role]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByAccountNumber(accountNumber) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE account_number = ?', [accountNumber]);
    return rows[0];
  }
}
