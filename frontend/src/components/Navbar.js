import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">🏦 SecureBank Portal</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        {user.role === 'customer' && <Link to="/payment">New Payment</Link>}
        <span className="navbar-user">👤 {user.username} ({user.role})</span>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
