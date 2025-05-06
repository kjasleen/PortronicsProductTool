// pages/index.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/dashboard/productcard';
import CreateProductLaunch from '../components/dashboard/createproductlaunch';

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch ongoing products
    setProducts([{ id: 1, name: 'Product 1', status: 'Ongoing' }, { id: 2, name: 'Product 2', status: 'Ongoing' }]);
  }, []);

  const handleCreateProduct = (productName) => {
    const newProduct = { id: Date.now(), name: productName, status: 'Ongoing' };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Product Dashboard</h1>
      <CreateProductLaunch onCreate={handleCreateProduct} />
      <div className="flex overflow-x-auto mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
