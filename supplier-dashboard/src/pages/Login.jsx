import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import './Login.css';
import Logo from '../components/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await HttpService.post('/api/login', form);
      localStorage.setItem('supplierId', res.id);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userRole', res.role);
      localStorage.setItem('username', form.username);
      navigate('/dashboard');
    } catch (err) {
      console.error("handleSubmit", err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="logo-top-left">
        <Logo />
      </div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner" /> : 'Login'}
          </button>

          <div className="forgot-password-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
