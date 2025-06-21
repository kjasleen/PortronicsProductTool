import React from 'react';
import './Logo.css?v=47'; // Optional: for custom styling
import logo from '../assets/logo.jpg'; // Adjust path if needed

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="Company Logo" className="company-logo" />
    </div>
  );
}
