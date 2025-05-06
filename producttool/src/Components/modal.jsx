// components/ui/Modal.js
import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
