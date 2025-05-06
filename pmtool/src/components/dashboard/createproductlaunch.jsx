// components/dashboard/CreateProductLaunch.js
import React, { useState } from 'react';
import Modal from '../ui/Modal';

const CreateProductLaunch = ({ onCreate }) => {
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');

  const handleSubmit = () => {
    onCreate(productName);
    setShowModal(false);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Create New Product Launch
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Create New Product</h3>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Create Product
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateProductLaunch;
