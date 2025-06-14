import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import './Login.css'; // External styling

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();
    //setError('');
     navigate('/dashboard');
     return;
    try {
      const res = await HttpService.post('/api/auth/login', form);
      console.log("Login", res);
      localStorage.setItem('token', res.token);

      if (onLoginSuccess) {
        onLoginSuccess({
          username: res.user.username,
          role: res.user.role
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.log("Login Error", err);
      setError(err.response?.data?.message || 'Login failed');
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

export default Login;
