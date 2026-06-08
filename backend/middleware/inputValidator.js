import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export const REGEX = {
  fullName: /^[a-zA-Z\s'-]{2,50}$/,
  idNumber: /^[0-9]{8,13}$/,
  accountNumber: /^[0-9]{10,12}$/,
  swiftCode: /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/,
  currency: /^(USD|EUR|GBP|ZAR|JPY|CAD|AUD|CHF)$/,
  amount: /^\d+(\.\d{1,2})?$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,256}$/,
  username: /^[a-zA-Z0-9]{4,20}$/
};

export async function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      error: 'Password is required.'
    };
  }

  if (password.length < 12) {
    return {
      valid: false,
      error: 'Password must be at least 12 characters long.'
    };
  }

  if (password.length > 256) {
    return {
      valid: false,
      error: 'Password must be less than 256 characters.'
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    const missing = [];
    if (!hasUppercase) missing.push('uppercase letter');
    if (!hasLowercase) missing.push('lowercase letter');
    if (!hasNumber) missing.push('number');
    if (!hasSpecial) missing.push('special character');
    return {
      valid: false,
      error: `Password must include at least one ${missing.join(', ')}.`
    };
  }

  const trimmed = password.trim().toLowerCase();
  const commonPasswords = [
    'password','password1','123456','12345678','qwerty','abc123','monkey','letmein','dragon','111111',
    'baseball','iloveyou','trustno1','sunshine','princess','football','shadow','superman','michael','ninja',
    'mustang','jessica','charley','abcdef','password123','welcome1'
  ];
  if (commonPasswords.includes(trimmed)) {
    return {
      valid: false,
      error: 'Password is too common. Please choose a more secure password.'
    };
  }

  return { valid: true };
}

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(v => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    console.warn(`Validation failed for IP ${req.ip}:`, errors.array());
    return res.status(400).json({ error: 'Invalid input detected. Please check your data.' });
  };
};

export const authValidation = {
  register: validate([
    body('username').matches(REGEX.username).withMessage('Username must be 4-20 alphanumeric characters'),
    body('fullName').matches(REGEX.fullName).withMessage('Invalid full name format'),
    body('idNumber').matches(REGEX.idNumber).withMessage('ID number must be 8-13 digits'),
    body('accountNumber').matches(REGEX.accountNumber).withMessage('Account number must be 10-12 digits'),
    body('password').isLength({ min: 12, max: 256 }).withMessage('Password must be at least 12 characters long')
  ]),
  login: validate([
    body('username').matches(REGEX.username),
    body('accountNumber').matches(REGEX.accountNumber),
    body('password').isLength({ min: 8 })
  ])
};

export const paymentValidation = {
  create: validate([
    body('amount').matches(REGEX.amount).withMessage('Amount must be a positive number with max 2 decimal places'),
    body('currency').matches(REGEX.currency).withMessage('Invalid currency selected'),
    body('swiftCode').matches(REGEX.swiftCode).withMessage('Invalid SWIFT code format'),
    body('beneficiaryAccount').matches(REGEX.accountNumber).withMessage('Beneficiary account must be 10-12 digits'),
    body('beneficiaryName').matches(REGEX.fullName).withMessage('Invalid beneficiary name')
  ])
};
