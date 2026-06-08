import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { securityHeaders } from './middleware/securityHeaders.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import { seedStaticEmployees } from './seedEmployees.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

// Security headers (Clickjacking, XSS, MITM protection)
app.use(securityHeaders);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Fingerprint']
}));

// Body parsing with size limits (DDoS protection)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// General rate limiting (DDoS protection)
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler (no stack trace leaks)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, async () => {
  try {
    const result = await seedStaticEmployees();
    console.log(`Static employee seed complete: ${result.created} created, ${result.existing} already present`);
  } catch (seedError) {
    console.error('Static employee seeding failed:', seedError.message);
  }
  console.log(`Secure server running on port ${PORT}`);
});
