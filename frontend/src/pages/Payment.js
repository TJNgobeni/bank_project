import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { validateField } from '../validators';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'CAD', 'AUD', 'CHF'];

function Payment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '', currency: 'USD', swiftCode: '', beneficiaryAccount: '', beneficiaryName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateField('amount', form.amount) || parseFloat(form.amount) <= 0) return setError('Enter a valid positive amount.');
    if (!validateField('swiftCode', form.swiftCode.toUpperCase())) return setError('Invalid SWIFT code format (e.g. AAAABB2L).');
    if (!validateField('beneficiaryAccount', form.beneficiaryAccount)) return setError('Beneficiary account must be 10-12 digits.');
    if (!validateField('beneficiaryName', form.beneficiaryName)) return setError('Invalid beneficiary name.');

    setLoading(true);
    try {
      const res = await api.post('/payments', { ...form, swiftCode: form.swiftCode.toUpperCase() });
      setSuccess(`Payment submitted! Transaction ID: #${res.data.transactionId}. Pending verification.`);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>New International Payment</h2>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" min="0.01" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>SWIFT / BIC Code <span className="hint">(e.g. AAAABB2L)</span></label>
            <input type="text" name="swiftCode" value={form.swiftCode} onChange={handleChange} placeholder="AAAABB2LXXX" maxLength={11} required style={{ textTransform: 'uppercase' }} />
          </div>
          <div className="form-group">
            <label>Beneficiary Account Number <span className="hint">(10-12 digits)</span></label>
            <input type="text" name="beneficiaryAccount" value={form.beneficiaryAccount} onChange={handleChange} placeholder="1234567890" required />
          </div>
          <div className="form-group">
            <label>Beneficiary Name</label>
            <input type="text" name="beneficiaryName" value={form.beneficiaryName} onChange={handleChange} placeholder="John Smith" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
