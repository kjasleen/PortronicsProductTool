import React from 'react';
import logo from '../assets/logo.png';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

function Header({ user, onLogout }) {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const goToDashboard = () => {
    navigate('/dashboard'); // ✅ Adjust route as per your routing setup
  };

  return (
    <div
      className="header-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
      }}
    >
      {/* ✅ Make logo clickable */}
      <img
        src={logo}
        alt="Logo"
        width={130}
        height={100}
        onClick={goToDashboard}
        style={{ cursor: 'pointer' }} // ✅ Add pointer cursor
        title="Back to Dashboard"
      />

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Welcome {user.username}
          </span>
          <button
            onClick={onLogout}
            className="relative group p-2 hover:bg-gray-100 rounded-full"
            title="Logout"
          >
            <FiLogOut size={24} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
