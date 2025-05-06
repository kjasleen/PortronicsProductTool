// components/dashboard/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-60 mr-4 mb-4">
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-gray-500 mt-2">{product.status}</p>
      <Link to={`/products/${product.id}`} className="text-blue-500 mt-2 inline-block">View Details</Link>
    </div>
  );
};

export default ProductCard;
