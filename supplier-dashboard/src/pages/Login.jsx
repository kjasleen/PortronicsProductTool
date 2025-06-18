import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await HttpService.post('/api/login', form);
    console.log("login response",res);
    localStorage.setItem('supplierId', res.id);
    localStorage.setItem('token', res.token);
    localStorage.setItem('userRole', res.role); // store user role

    // Navigate based on role
    //if (res.role === 'supplier') {
      navigate('/dashboard');
    //}else {
      setError('Unknown user role');
    //}
  } catch (err) {
    console.error("handleSubmit", err);
    setError('Invalid username or password');
  }
};

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
