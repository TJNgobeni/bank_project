import rateLimit from 'express-rate-limit';
import { securityConfig } from '../config/security.js';

export const apiLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.max,
  message: { error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: securityConfig.rateLimit.loginMax,
  message: { error: 'Too many login attempts. Please try again later.' },
  skipSuccessfulRequests: true,
});

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: securityConfig.rateLimit.paymentMax,
  message: { error: 'Payment limit reached. Maximum 5 payments per hour.' }
});
