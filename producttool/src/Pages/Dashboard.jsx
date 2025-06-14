import React, { useEffect, useState } from 'react';
import HttpService from '../Utils/HttpService';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with real API call if needed
        const dummyData = [
          {
            orderId: 'ORD001',
            productName: 'Smart Watch',
            totalOrdered: 100,
            productionStarted: 50,
            productionCompleted: 20,
            shippingStarted: 10,
            shipped: 5,
            supplier: 'XYZ Supplier',
            status: 'Production Started',
          },
          {
            orderId: 'ORD002',
            productName: 'Wireless Earbuds',
            totalOrdered: 200,
            productionStarted: 100,
            productionCompleted: 80,
            shippingStarted: 50,
            shipped: 30,
            supplier: 'ABC Supplier',
            status: 'Shipped',
          },
        ];
        setOrders(dummyData);

        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role || '');
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Send update to backend if needed
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  const uniqueStatuses = [...new Set(orders.map(order => order.status))];

  return (
    <div className="min-h-screen px-6 py-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">📊 Product Dashboard</h1>

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          className="border rounded p-2 shadow"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Product</th>
              <th className="p-3">Supplier</th>
              <th className="p-3 text-center">Ordered</th>
              <th className="p-3 text-center">Started</th>
              <th className="p-3 text-center">Completed</th>
              <th className="p-3 text-center">Shipping</th>
              <th className="p-3 text-center">Shipped</th>
              <th className="p-3">Status</th>
              {userRole === 'vendor.supplier' && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderId} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{order.productName}</td>
                <td className="p-3">{order.supplier}</td>
                <td className="p-3 text-center">{order.totalOrdered}</td>
                <td className="p-3 text-center">{order.productionStarted}</td>
                <td className="p-3 text-center">{order.productionCompleted}</td>
                <td className="p-3 text-center">{order.shippingStarted}</td>
                <td className="p-3 text-center">{order.shipped}</td>
                <td className="p-3">{order.status}</td>
                {userRole === 'vendor.supplier' && (
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.orderId, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option>Production Started</option>
                      <option>Production Completed</option>
                      <option>Shipping Started</option>
                      <option>Shipped</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
