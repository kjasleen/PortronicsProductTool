import React, { useState } from 'react';
import HttpService from '../Utils/HttpService';
import './ForgotPassword.css'; 
import Logo from '../components/Logo';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      await HttpService.post('/api/forgot-password', { email });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Logo /> 
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      {status === 'success' && (
        <p className="success-message">Reset link sent! Please check your email.</p>
      )}
      {status === 'error' && (
        <p className="error-message">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
