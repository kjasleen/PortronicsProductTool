import React from 'react';
import logo from '../assets/logo.jpg';
import './Logo.css?v=48';

export default function Logo() {
  return (
    <img src={logo} alt="Company Logo" className="company-logo" />
  );
}
