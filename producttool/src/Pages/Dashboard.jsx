import React, { useState, useEffect } from 'react';
import ProductList from '../Components/ProductList';
import AddProductModal from '../Components/AddProductModal';
import HttpService from '../Utils/HttpService';

function Dashboard() {
  const [ongoingProducts, setOngoingProducts] = useState([]);
  const [completedProducts, setCompletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await HttpService.get('http://localhost:5000/api/products/');
      const products = Array.isArray(data) ? data : [];
      setOngoingProducts(products.filter(p => p.status === 'Ongoing'));
      setCompletedProducts(products.filter(p => p.status === 'Completed'));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => fetchProducts();

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      {/* Page Heading */}
      <h1 className="!text-5xl font-extrabold text-blue-800 text-center mb-10 tracking-tight">
        Product Dashboard
      </h1>

      {/* Add Product Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="!bg-blue-600 !text-white text-lg font-semibold px-6 py-3 rounded-lg shadow hover:!bg-blue-700 transition duration-200"
        >
          + Add Product
        </button>
      </div>

      {/* Ongoing Products */}
      <div className="mb-12">
        <ProductList
          products={ongoingProducts}
          title="🟡 Ongoing Products"
          noProductsMessage="No ongoing products available"
        />
      </div>

      {/* Completed Products */}
      <div>
        <ProductList
          products={completedProducts}
          title="✅ Completed Products"
          noProductsMessage="No completed products available"
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}

export default Dashboard;
