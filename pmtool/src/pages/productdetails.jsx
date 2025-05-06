
// src/pages/ProductDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Details - ID: {id}</h1>
      {/* More details and phases/tasks can go here */}
    </div>
  );
};

export default ProductDetails;
