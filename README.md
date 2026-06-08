# International Payments Portal

A secure banking web application with customer and employee portals.

## Prerequisites
- Node.js 18+
- MySQL 8+

## Setup

### 1. Database
```bash
mysql -u root -p < backend/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # or edit .env directly
npm install
npm start
```

Backend runs on http://localhost:3001

**Edit `backend/.env`:**
```
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=international_payments
JWT_SECRET=your-super-secret-key-min-32-chars
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## Default Employee Account
- Username: `employee1`
- Account Number: `1234567890`
- Password: `Employee@123`

## Features
- Customer: Register, Login, Submit international payments, View payment history
- Employee: Login, View & verify pending transactions (submitted to SWIFT)
- Security: JWT auth, rate limiting, input validation, helmet headers, bcrypt passwords
