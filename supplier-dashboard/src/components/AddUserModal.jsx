import React, { useState } from 'react';
import HttpService from '../Utils/HttpService';

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', password: '', role: 'supplier' });

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
    <div className="modal-backdrop">
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
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
