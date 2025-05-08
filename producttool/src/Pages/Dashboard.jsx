import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../Components/ProductList';

function Dashboard() {
  const [ongoingProducts, setOngoingProducts] = useState([]);
  const [completedProducts, setCompletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        console.log('Response:', res.data);  // Log to inspect the response
    
        // Ensure res.data is an array (even if it's empty)
        const products = Array.isArray(res.data) ? res.data : [];  // Default to an empty array if not an array
    
        // Separate products into ongoing and completed
        const ongoing = products.filter(product => product.status === 'Ongoing');
        const completed = products.filter(product => product.status === 'Completed');
    
        setOngoingProducts(ongoing);
        setCompletedProducts(completed);
        setLoading(false);
    
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleNavigate = () => {
    // This function can be used to navigate to the product creation page
  };

  if (loading) {
    return <div>Loading...</div>;  // Show loading state while data is being fetched
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if there’s a problem
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight text-center mb-4">
        Products
      </h1>

      {/* Button to navigate to the page for adding new products */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleNavigate}
          className="bg-blue-600 text-black !text-2xl px-8 py-4 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Display Ongoing Products */}
      <ProductList
        products={ongoingProducts}
        title="Ongoing Products"
        noProductsMessage="No Ongoing Products"
      />

      {/* Display Completed Products */}
      <ProductList
        products={completedProducts}
        title="Completed Products"
        noProductsMessage="No Completed Products"
      />
    </div>
  );
}

export default Dashboard;
