export const REGEX = {
  fullName: /^[a-zA-Z\s'-]{2,50}$/,
  idNumber: /^[0-9]{8,13}$/,
  accountNumber: /^[0-9]{10,12}$/,
  swiftCode: /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/,
  currency: /^(USD|EUR|GBP|ZAR|JPY|CAD|AUD|CHF)$/,
  amount: /^\d+(\.\d{1,2})?$/,
  password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
  username: /^[a-zA-Z0-9_]{4,20}$/
};

export const validateField = (name, value) => {
  const patterns = {
    username: REGEX.username,
    fullName: REGEX.fullName,
    idNumber: REGEX.idNumber,
    accountNumber: REGEX.accountNumber,
    password: REGEX.password,
    amount: REGEX.amount,
    currency: REGEX.currency,
    swiftCode: REGEX.swiftCode,
    beneficiaryAccount: REGEX.accountNumber,
    beneficiaryName: REGEX.fullName
  };
  if (!patterns[name]) return true;
  return patterns[name].test(value);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};
