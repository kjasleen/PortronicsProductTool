import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi'; // lightweight trash icon
import HttpService from '../Utils/HttpService';

const ProductList = ({ products, title, noProductsMessage, onRefresh }) => {
  const navigate = useNavigate();

  const handleClick = (product) => {
    navigate(`/products/${product._id}`);
  };

  const handleDelete = async (productId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await HttpService.delete(`http://localhost:5000/api/products/${productId}`);
      onRefresh();
    } catch (error) {
      alert('Error deleting product');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-left">{title}</h2>
      {products.length === 0 ? (
        <p className="text-2xl text-blue-400">{noProductsMessage}</p>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product)}
              className="relative shrink-0 w-44 h-44 bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl shadow-md flex items-center justify-center text-xl font-semibold text-blue-900 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer group"
            >
              {product.name}
              <button
                onClick={(e) => handleDelete(product._id, e)}
                title="Delete Product"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 !bg-white !text-red-500 hover:!text-red-700 rounded-full p-1 shadow-sm"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProductList;
