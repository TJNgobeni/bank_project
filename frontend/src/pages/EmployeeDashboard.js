import React, { useState, useEffect } from 'react';
import api from '../api';

function EmployeeDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/payments/pending');
      setPending(res.data);
    } catch (err) {
      setError('Failed to load pending payments.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.post(`/payments/verify/${id}`);
      setMessage(`Transaction #${id} verified and submitted to SWIFT.`);
      setPending(pending.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Employee Dashboard — Pending Verifications</h2>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {loading && <p>Loading...</p>}
        {!loading && pending.length === 0 && <p className="empty-state">No pending transactions. ✅</p>}
        {pending.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Beneficiary</th>
                <th>SWIFT</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.full_name}<br /><small>{p.username}</small></td>
                  <td>{parseFloat(p.amount).toFixed(2)}</td>
                  <td>{p.currency}</td>
                  <td>{p.beneficiary_name}<br /><small>{p.beneficiary_account}</small></td>
                  <td>{p.swift_code}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => handleVerify(p.id)}>
                      ✓ Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
