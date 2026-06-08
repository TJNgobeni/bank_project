import { REGEX, validateField } from '../validators';

describe('validators', () => {
  it('accepts valid username', () => expect(validateField('username', 'employee_1')).toBe(true));
  it('rejects too-short username', () => expect(validateField('username', 'ab')).toBe(false));
  it('accepts valid account number', () => expect(validateField('accountNumber', '1234567890')).toBe(true));
  it('rejects invalid account number', () => expect(validateField('accountNumber', '12345')).toBe(false));
});
