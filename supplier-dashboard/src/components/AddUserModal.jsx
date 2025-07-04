import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import './AddUserModal.css';
import { Eye, EyeOff } from 'lucide-react';

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'supplier' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match");
      }
      await HttpService.post('/api/register', formData);
      alert('User created successfully!');
      onClose();
    } catch (err) {
      console.error('User creation failed:', err);
      alert('Error creating user');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Register New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          </div>
          <div className="input-wrapper">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>

          <div className="input-wrapper">
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="supplier">Vendor</option>
              <option value="company">Portronics User</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">Register</button>
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
