import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import './ResetPassword.css'; // ⬅️ Add this file for the spinner
import Logo from '../components/Logo';


export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // 🌀 Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true); // 🔃 Start loader

    try {
      await HttpService.post(`/api/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
    } catch (err) {
      console.error(err);
      setError("Token may be expired or invalid");
    } finally {
      setLoading(false); // 🛑 Stop loader
    }
  };

  return (
    <div className="login-container">
      <Logo />
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Reset Password'}
        </button>

        {success && <p className="success-message">Password updated! Redirecting to login...</p>}
      </form>
    </div>
  );
}
