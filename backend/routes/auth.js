import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authValidation, validatePasswordStrength } from '../middleware/inputValidator.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { User } from '../models/User.js';
import { securityConfig } from '../config/security.js';

const router = express.Router();

const generateFingerprint = (req) => {
  const data = req.ip + req.headers['user-agent'];
  return crypto.createHash('sha256').update(data).digest('hex');
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// POST /api/auth/login:
router.post('/login', loginLimiter, authValidation.login, async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (user.account_number !== accountNumber) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await User.verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const fingerprint = generateFingerprint(req);

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, fingerprint },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: securityConfig.jwt.expiresIn }
    );

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: securityConfig.session.maxAge
    });

    res.json({
      message: 'Login successful',
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logout successful' });
});

export default router;
