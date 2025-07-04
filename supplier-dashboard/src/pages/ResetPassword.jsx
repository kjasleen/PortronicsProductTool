import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import './ResetPassword.css';
import Logo from '../components/Logo';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Use lucide icons

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await HttpService.post(`/api/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      setError("Token may be expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Logo />
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye /> : <EyeOff />}
          </span>

        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <span className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Reset Password'}
        </button>

        {success && <p className="success-message">Password updated! Redirecting to login...</p>}
      </form>
    </div>
  );
}
