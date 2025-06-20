import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import './AddUserModal.css';

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', password: '', role: 'supplier' });

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
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <select name="role" onChange={handleChange}>
            <option value="supplier">Supplier</option>
            <option value="company">Company</option>
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
