import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import CreateOrderModal from '../components/CreateOrderModal';
import EditOrderModal from '../components/EditOrderModal';
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await HttpService.get('/api/orders');
      setOrders(data);

      let supplierId = localStorage.getItem('supplierId');
      let filteredData = data;

      if (userRole === 'supplier') {
        filteredData = data.filter(order => order.supplier?._id === supplierId);
      }

      setFiltered(filteredData);

      if (data.length && data[0].supplier?.supplierName) {
        const uniqueSuppliers = [...new Map(data.map(o => [o.supplier._id, o.supplier.supplierName])).entries()]
          .map(([id, name]) => ({ id, name }));
        setSuppliers(uniqueSuppliers);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    let filteredOrders = [...orders];

    if (statusFilter !== '') {
      filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }

    if (supplierFilter !== '') {
      filteredOrders = filteredOrders.filter(o => o.supplier._id === supplierFilter);
    }

    if (userRole === 'supplier') {
      filteredOrders = filteredOrders.filter(order => order.supplier?._id === localStorage.getItem('supplierId'));
    }

    setFiltered(filteredOrders);
  }, [statusFilter, supplierFilter, orders]);

  const handleCreateOrder = async (newOrder) => {
    try {
      const supplierId = localStorage.getItem('supplierId');
      newOrder.supplier = supplierId;
      const createdOrder = await HttpService.post('/api/orders/create', newOrder);
      const updatedOrders = [...orders, createdOrder];
      setOrders(updatedOrders);
      setFiltered(updatedOrders);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      await HttpService.put(`/api/orders/${updatedOrder._id}`, updatedOrder);
      const updated = orders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      setOrders(updated);
      setFiltered(updated);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-heading">Order Dashboard / Report</h2>
        {(userRole === 'admin') && (
          <button
            className="add-user-button"
            onClick={() => alert('Open Add User Modal or Navigate to Add User Page')}
          >
            + Add User
          </button>
        )}
      </div>

      <div className="controls">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Production Started">Production Started</option>
          <option value="Shipped">Shipped</option>
        </select>

        {(userRole === 'company' || userRole === 'admin') && (
          <select onChange={(e) => setSupplierFilter(e.target.value)} value={supplierFilter}>
            <option value="">All Suppliers</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        {userRole === 'supplier' && (
          <button className="add-order-button" onClick={() => setShowCreateModal(true)}>
            + Create Order
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Total Ordered</th>
              <th>Production Started</th>
              <th>Production Start Date</th>
              <th>Estimated Completion</th>
              <th>Shipping Date</th>
              <th>Shipped</th>
              <th>Supplier</th>
              {userRole === 'supplier' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.productName}</td>
                <td>{order.totalOrdered}</td>
                <td>{order.productionStarted}</td>
                <td>{order.productionStartedDate ? new Date(order.productionStartedDate).toLocaleDateString() : '—'}</td>
                <td>{order.estimatedProductionCompletionDate ? new Date(order.estimatedProductionCompletionDate).toLocaleDateString() : '—'}</td>
                <td>{order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : '—'}</td>
                <td>{order.shipped}</td>
                <td>{(userRole === 'company' || userRole === 'admin') ? (order.supplier?.supplierName || 'N/A') : 'You'}</td>
                {userRole === 'supplier' && (
                  <td>
                    <button className="edit-order-button" onClick={() => handleOpenEditModal(order)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateOrderModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateOrder} />
      )}

      {showEditModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default Dashboard;
