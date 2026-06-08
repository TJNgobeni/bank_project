import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Dashboard({ user }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/my-payments');
      setPayments(res.data);
    } catch (err) {
      setError('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', verified: 'badge-success', rejected: 'badge-error', submitted: 'badge-info' };
    return <span className={`badge ${map[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Welcome, {user.username}</h2>
        <Link to="/payment" className="btn btn-primary">+ New Payment</Link>
      </div>

      <div className="card">
        <h3>My Payments</h3>
        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && payments.length === 0 && (
          <p className="empty-state">No payments yet. <Link to="/payment">Make your first payment</Link>.</p>
        )}
        {payments.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Beneficiary</th>
                <th>SWIFT</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{parseFloat(p.amount).toFixed(2)}</td>
                  <td>{p.currency}</td>
                  <td>{p.beneficiary_name}<br /><small>{p.beneficiary_account}</small></td>
                  <td>{p.swift_code}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
