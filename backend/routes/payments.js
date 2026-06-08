import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { paymentValidation } from '../middleware/inputValidator.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';
import { Transaction } from '../models/Transaction.js';
import { REGEX } from '../middleware/inputValidator.js';

const router = express.Router();

// POST /api/payments - Create payment
router.post('/', authenticateToken, paymentLimiter, paymentValidation.create, async (req, res) => {
  try {
    const { amount, currency, swiftCode, beneficiaryAccount, beneficiaryName } = req.body;

    if (!REGEX.amount.test(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }

    const transactionId = await Transaction.create({
      userId: req.user.userId,
      amount: parseFloat(amount).toFixed(2),
      currency,
      swiftCode: swiftCode.toUpperCase(),
      beneficiaryAccount,
      beneficiaryName
    });

    console.log(`Payment created by ${req.user.username}: ID ${transactionId}`);

    res.status(201).json({
      message: 'Payment submitted successfully. Pending verification.',
      transactionId
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed.' });
  }
});

// GET /api/payments/my-payments
router.get('/my-payments', authenticateToken, async (req, res) => {
  try {
    const payments = await Transaction.findByUserId(req.user.userId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payments.' });
  }
});

// GET /api/payments/pending - Employee only
router.get('/pending', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const pending = await Transaction.findPending();
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pending payments.' });
  }
});

// POST /api/payments/verify/:id - Employee only
router.post('/verify/:id', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID.' });
    }

    await Transaction.updateStatus(id, 'verified', req.user.userId);

    console.log(`Transaction ${id} verified by employee ${req.user.username}`);

    res.json({ message: 'Transaction verified and submitted to SWIFT.' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// GET /api/payments/public-lookup - Public read-only
router.get('/public-lookup', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Missing search term.' });
    }
    const rows = await Transaction.findByPublicLookup(query);
    const grouped = rows.reduce((acc, row) => {
      const key = `${row.username}::${row.full_name}`;
      if (!acc[key]) {
        acc[key] = { username: row.username, full_name: row.full_name, transactions: [] };
      }
      acc[key].transactions.push({
        id: row.id,
        amount: row.amount,
        currency: row.currency,
        swift_code: row.swift_code,
        beneficiary_account: row.beneficiary_account,
        beneficiary_name: row.beneficiary_name,
        status: row.status,
        created_at: row.created_at
      });
      return acc;
    }, {});
    const values = Object.values(grouped);
    if (values.length === 0) {
      return res.json({ username: query, full_name: query, transactions: [] });
    }
    res.json(values[0]);
  } catch (error) {
    console.error('Public lookup error:', error);
    res.status(500).json({ error: 'Lookup failed.' });
  }
});

export default router;
