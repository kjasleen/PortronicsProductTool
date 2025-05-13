import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../Components/ProductList';
import AddProductModal from '../Components/AddProductModal'; // Import the modal
import HttpService from '../Utils/HttpService';


function Dashboard() {
  const [ongoingProducts, setOngoingProducts] = useState([]);
  const [completedProducts, setCompletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state



  const fetchProducts = async () => {

    let data = await HttpService.get('http://localhost:5000/api/products/');
    console.log("Products in Response", data);
    const products = Array.isArray(data) ? data : [];
    const ongoing = products.filter(product => product.status === 'Ongoing');
    const completed = products.filter(product => product.status === 'Completed');
    setOngoingProducts(ongoing);
    setCompletedProducts(completed);
    setLoading(false);

    /*try {

      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/products/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Products in Response", data);
      /*const products = Array.isArray(res.data) ? res.data : [];
      const ongoing = products.filter(product => product.status === 'Ongoing');
      const completed = products.filter(product => product.status === 'Completed');

      if(products.length > 0)
      console.log("first Products- ", products[0]);

      setOngoingProducts(ongoing);
      setCompletedProducts(completed);
      setLoading(false);
    } catch (err) {

      if (err.response && err.response.status === 401) {
        const message = err.response.data?.message || '';
        if (message.toLowerCase().includes('expired')) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError("You are not authorized to view this resource.");
        }
      }
      setLoading(false);
    }*/
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    fetchProducts(); // Refresh product list after adding a product
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight text-center mb-4">
        Products
      </h1>

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-black !text-2xl px-8 py-4 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Product Lists */}
      <ProductList
        products={ongoingProducts}
        title="Ongoing Products"
        noProductsMessage="No Ongoing Products"
      />
      <ProductList
        products={completedProducts}
        title="Completed Products"
        noProductsMessage="No Completed Products"
      />

      {/* Modal */}
      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}

export default Dashboard;
