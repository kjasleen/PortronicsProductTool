// Components/SupplierDashboardTable.jsx
import React, { useState } from 'react';

function SupplierDashboardTable({ orders, role, onStageChange }) {
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('orderId');

  const handleFilterChange = (e) => setFilterStatus(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);

  const filteredOrders = orders
    .filter(order => !filterStatus || order.status === filterStatus)
    .sort((a, b) => a[sortBy]?.localeCompare?.(b[sortBy]) || 0);

  const handleStageUpdate = (orderId, newStage) => {
    if (onStageChange) onStageChange(orderId, newStage);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Orders Overview</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select onChange={handleFilterChange} className="border px-3 py-2 rounded-md">
          <option value="">All Status</option>
          <option value="Production Started">Production Started</option>
          <option value="Production Completed">Production Completed</option>
          <option value="Shipped">Shipped</option>
        </select>
        <select onChange={handleSortChange} className="border px-3 py-2 rounded-md">
          <option value="orderId">Sort by Order ID</option>
          <option value="productName">Sort by Product</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Total Ordered</th>
            <th className="p-2 border">In Production</th>
            <th className="p-2 border">Completed</th>
            <th className="p-2 border">Shipped</th>
            <th className="p-2 border">Status</th>
            {role === 'supplier' && <th className="p-2 border">Update Stage</th>}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.orderId} className="text-center">
              <td className="border px-2 py-1">{order.orderId}</td>
              <td className="border px-2 py-1">{order.productName}</td>
              <td className="border px-2 py-1">{order.totalOrdered}</td>
              <td className="border px-2 py-1">{order.productionStarted}</td>
              <td className="border px-2 py-1">{order.productionCompleted}</td>
              <td className="border px-2 py-1">{order.shipped}</td>
              <td className="border px-2 py-1">{order.status}</td>
              {role === 'supplier' && (
                <td className="border px-2 py-1">
                  <select
                    value={order.status}
                    onChange={e => handleStageUpdate(order.orderId, e.target.value)}
                    className="border px-2 py-1"
                  >
                    <option value="Production Started">Production Started</option>
                    <option value="Production Completed">Production Completed</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierDashboardTable;
