import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import './AddUserModal.css';

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'supplier' });

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
      console.log(formData);
      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match");
      }
      await HttpService.post('/api/register', formData);
      alert('User created successfully!');
      onClose();
    } catch (err) {
      console.error('User creation failed:', err);
      alert('Error creating user', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Register New User</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <select name="role" onChange={handleChange}>
            <option value="supplier">Vendor</option>
            <option value="company">Portronics User</option>
          </select>
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
