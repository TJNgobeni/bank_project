-- International Payments Portal Database Schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS international_payments 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE international_payments;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(50) NOT NULL,
  id_number VARCHAR(13) NOT NULL,
  account_number VARCHAR(12) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'employee') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_account (account_number),
  INDEX idx_username (username)
) ENGINE=InnoDB;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  swift_code VARCHAR(11) NOT NULL,
  beneficiary_account VARCHAR(12) NOT NULL,
  beneficiary_name VARCHAR(50) NOT NULL,
  status ENUM('pending', 'verified', 'rejected', 'submitted') DEFAULT 'pending',
  verified_by INT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (verified_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Sample employee account (password: Employee@123)
INSERT INTO users (username, full_name, id_number, account_number, password_hash, role) 
VALUES (
  'employee1', 
  'John Banker', 
  '8501015001087', 
  '1234567890',
  '$2b$12$E8oicZvy9oDI89sJmXXiSuPbXOgX8mpiTY05MzHBN4PigedaTzn.G',
  'employee'
) ON DUPLICATE KEY UPDATE id=id;
