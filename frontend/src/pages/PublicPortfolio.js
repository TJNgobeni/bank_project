import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function PublicPortfolio() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const trimmed = query.trim();
    if (!trimmed) {
      return setError('Please enter a username or full name.');
    }
    setLoading(true);
    try {
      const res = await api.get(`/payments/public-lookup?q=${encodeURIComponent(trimmed)}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <header className="public-header">
        <div className="public-header-inner">
          <div className="brand">
            <div className="brand-logo-icon">🏦</div>
            <div className="brand-logo-text">SecureBank</div>
          </div>
          <nav className="public-nav">
            <Link to="/login" className="btn btn-ghost">Employee Login</Link>
          </nav>
        </div>
      </header>

      <main className="public-main">
        <section className="public-hero">
          <h1>International Payments Portal</h1>
          <p>Customers can view their submitted payments and track SWIFT status.</p>
        </section>

        <section className="public-search">
          <form className="search-card" onSubmit={handleSearch}>
            <h2>Find a submitted payment</h2>
            <p>Search by username or full name to view payment records.</p>
            <div className="search-row">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter username or full name"
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
          </form>
        </section>

        {result && (
          <section className="public-results">
            <div className="results-card">
              <div className="results-header">
                <div>
                  <h3>{result.full_name}</h3>
                  <span className="muted">@{result.username}</span>
                </div>
                <span className="badge badge-info">{result.count} transaction(s)</span>
              </div>

              {result.transactions.length === 0 && (
                <p className="empty-state">No payments submitted yet.</p>
              )}

              <div className="table-wrapper">
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
                    {result.transactions.map((t) => (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td>{parseFloat(t.amount).toFixed(2)}</td>
                        <td>{t.currency}</td>
                        <td>
                          {t.beneficiary_name}
                          <br />
                          <small>{t.beneficiary_account}</small>
                        </td>
                        <td>{t.swift_code}</td>
                        <td>
                          <span className={`badge ${statusBadgeClass(t.status)}`}>{t.status}</span>
                        </td>
                        <td>{new Date(t.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="public-footer">
        <span>SecureBank © {new Date().getFullYear()}. Read-only public view.</span>
      </footer>
    </div>
  );
}

function statusBadgeClass(status) {
  const map = {
    pending: 'badge-warning',
    verified: 'badge-success',
    rejected: 'badge-error',
    submitted: 'badge-info'
  };
  return map[status] || '';
}

export default PublicPortfolio;
