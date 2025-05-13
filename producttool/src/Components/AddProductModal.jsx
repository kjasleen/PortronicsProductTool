import React, { useState } from 'react';
import HttpService from '../Utils/HttpService';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Product name is required");
    try 
    {
        let data = { name, categories: categories.split(',').map(c => c.trim()), status: 'Ongoing'}
        await HttpService.post('http://localhost:5000/api/products/create', data);

        onProductAdded();
        onClose();
    } catch (err) {
      console.error('Error adding product:', err);
      alert("Failed to add product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Categories (comma-separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
       <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          OK
        </button>
      </div>

      </div>
    </div>
  );
};

export default AddProductModal;
