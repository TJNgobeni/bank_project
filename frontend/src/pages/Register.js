import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { validateField } from '../validators';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', fullName: '', idNumber: '', accountNumber: '', password: ''
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

    const fields = ['username', 'fullName', 'idNumber', 'accountNumber', 'password'];
    for (const field of fields) {
      if (!validateField(field, form[field])) {
        return setError(`Invalid ${field}. Please check the format.`);
      }
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🏦 SecureBank</h2>
        <h3>Create Account</h3>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username <span className="hint">(4-20 alphanumeric)</span></label>
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="johndoe123" required />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>ID Number <span className="hint">(8-13 digits)</span></label>
            <input type="text" name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="8501015001087" required />
          </div>
          <div className="form-group">
            <label>Account Number <span className="hint">(10-12 digits)</span></label>
            <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="1234567890" required />
          </div>
          <div className="form-group">
            <label>Password <span className="hint">(min 8 chars, 1 uppercase, 1 number, 1 special)</span></label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Secure@123" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
