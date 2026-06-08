import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/security.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key-change-in-production', {
      algorithms: ['HS256']
    });

    req.user = decoded;

    // Session hijacking detection
    const tokenFingerprint = decoded.fingerprint;
    const sessionFingerprint = req.headers['x-session-fingerprint'];

    if (tokenFingerprint && sessionFingerprint && tokenFingerprint !== sessionFingerprint) {
      return res.status(403).json({ error: 'Session invalidated. Please login again.' });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Session expired. Please login again.' });
    }
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
};
