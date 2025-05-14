import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import { useParams, useNavigate  } from "react-router-dom";

const statusColorMap = {
  'Completed': '!bg-green-100 text-green-800 border-green-400',
  'Approval Pending': '!bg-red-200 text-yellow-800 border-yellow-400',
  'Ongoing': '!bg-blue-100 text-blue-800 border-blue-400',
};

const ProductReport = () => {
  const navigate = useNavigate();

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const reportData = await HttpService.get(`http://localhost:5000/api/products/report/${productId}`);
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
  }, [productId]);

  if (loading) return <div className="text-blue-700 p-4">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}  // Navigate to dashboard
          className="!text-lg !text-white !bg-blue-400 hover:!bg-blue-500 rounded-lg px-6 py-3 mb-4 shadow-lg transition-colors duration-300"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl font-bold text-blue-800 text-center mb-6">{product.name} Report</h1>

      {/* Product Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-600">Product Information</h2>
        <p className="text-base text-blue-500">Status: {product.status}</p>
        <p className="text-base text-blue-500">Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Phases and Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Phases</h2>
        {phases.length === 0 ? (
          <p className="text-gray-500">No phases found for this product.</p>
        ) : (
          phases.map((phase) => (
            <div key={phase._id} className="mb-6">
              <div className="p-4 bg-white rounded-lg shadow-md border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-1">{phase.name}</h3>
                <p className="text-sm text-gray-700 mb-3">Status: {phase.status}</p>

                {phase.tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks assigned to this phase.</p>
                ) : (
                  <div className="mt-2">
                    <h4 className="font-semibold text-blue-600 mb-2">Tasks:</h4>
                    <ul className="space-y-2">
                      {phase.tasks.map((task) => {
                        const statusClass = statusColorMap[task.status] || 'bg-gray-100 text-gray-800 border-gray-400';
                        return (
                          <li
                            key={task._id}
                            className={`rounded-md px-4 py-2 border-l-4 ${statusClass} shadow-sm text-sm`}
                          >
                            <div className="font-medium">{task.name}</div>
                            <div className="flex justify-between text-xs">
                              <span>Status: {task.status}</span>
                              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                          </li>
                        );
                      })}
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
