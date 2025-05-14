import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService'; // Assuming this is your HTTP service to fetch data
import { useParams } from "react-router-dom";

const ProductReport = () => {
  const { productId } = useParams();  // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetching the product report (including phases and tasks)
        const reportData = await HttpService.get(`http://localhost:5000/api/products/report/${productId}`);
        
        // Set the fetched data to state
        setProduct(reportData.product);
        setPhases(reportData.phases);
        setLoading(false);
      } catch (err) {
        setError('Failed to load report data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchReportData();
  }, [productId]); // Fetch report data when the productId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      {/* Product Title */}
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-8">{product.name} Report</h1>

      {/* Product Details */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">Product Information</h2>
        <p className="text-lg text-blue-500">Status: {product.status}</p>
        <p className="text-lg text-blue-500">Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Phases and Tasks */}
      <div>
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Phases</h2>
        {phases.length === 0 ? (
          <p>No phases found for this product.</p>
        ) : (
          phases.map((phase) => (
            <div key={phase._id} className="mb-6">
              <div className="p-4 bg-blue-50 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-700">{phase.name}</h3>
                <p>Status: {phase.status}</p>

                {/* Task List for Each Phase */}
                {phase.tasks.length === 0 ? (
                  <p>No tasks assigned to this phase.</p>
                ) : (
                  <div className="mt-4">
                    <h4 className="font-semibold text-blue-600">Tasks:</h4>
                    <ul className="list-disc pl-6">
                      {phase.tasks.map((task) => (
                        <li key={task._id} className="text-blue-500">
                          {task.name} - Status: {task.status} - Created At: {new Date(task.createdAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReport;
