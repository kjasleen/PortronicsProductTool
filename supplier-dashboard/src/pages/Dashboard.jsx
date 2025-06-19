import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';
import CreateOrderModal from '../components/CreateOrderModal';
import EditOrderModal from '../components/EditOrderModal';
import AddUserModal from '../components/AddUserModal';
import { FiLogOut } from 'react-icons/fi';
import './Dashboard.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await HttpService.get('/api/orders');
      setOrders(data);
      applyFilters(data);

      if (data.length && data[0].supplier?.username) {
        const uniqueSuppliers = [
          ...new Map(data.map(o => [o.supplier._id, o.supplier.username])).entries()
        ].map(([id, username]) => ({ id, username }));
        setSuppliers(uniqueSuppliers);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.status === 401 || error.message?.includes('jwt')) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  };

  const applyFilters = (data) => {
    let filteredOrders = [...data];

    if (statusFilter) {
      filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }

    if (supplierFilter) {
      filteredOrders = filteredOrders.filter(o => o.supplier._id === supplierFilter);
    }

    if (userRole === 'supplier') {
      filteredOrders = filteredOrders.filter(order => order.supplier?._id === localStorage.getItem('supplierId'));
    }

    setFiltered(filteredOrders);
  };

  useEffect(() => {
    applyFilters(orders);
  }, [statusFilter, supplierFilter, orders]);

  const handleCreateOrder = async (newOrder) => {
    try {
      const supplierId = localStorage.getItem('supplierId');
      newOrder.supplier = supplierId;

      await HttpService.post('/api/orders/create', newOrder);
      setShowCreateModal(false);
      await fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const exportToExcel = () => {
    const visibleData = filtered.map(order => ({
      'Order ID': order._id,
      'Product': order.productName,
      'Total Ordered': order.totalOrdered,
      'Production Started': order.productionStarted,
      'Production Start Date': order.productionStartedDate ? new Date(order.productionStartedDate).toLocaleDateString() : '',
      'Completion Date': order.productionCompletionDate ? new Date(order.productionCompletionDate).toLocaleDateString() : '',
      'Shipping Mode': order.shippingMode || '',
      'Shipping Date': order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : '',
      'Shipped': order.shipped,
      'Landing Port': order.landingPort || '',
      'Landing Date': order.estimatedLandingDate ? new Date(order.estimatedLandingDate).toLocaleDateString() : '',
      'With Packing': order.withPacking ? 'Yes' : 'No',
      'Master Carton Size': order.masterCartonSize || '',
      ...(userRole !== 'supplier' && {
        'Supplier': order.supplier?.username || '',
      })
    }));

    const worksheet = XLSX.utils.json_to_sheet(visibleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders_export.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l'); // landscape for wider tables

    const headers = [
      'Order ID', 'Product', 'Total Ordered', 'Production Started', 'Production Start Date',
      'Completion Date', 'Shipping Mode', 'Shipping Date', 'Shipped',
      'Landing Port', 'Landing Date', 'With Packing', 'Master Carton Size',
      ...(userRole !== 'supplier' ? ['Supplier'] : [])
    ];

    const rows = filtered.map(order => [
      order._id,
      order.productName,
      order.totalOrdered,
      order.productionStarted,
      order.productionStartedDate ? new Date(order.productionStartedDate).toLocaleDateString() : '',
      order.productionCompletionDate ? new Date(order.productionCompletionDate).toLocaleDateString() : '',
      order.shippingMode || '',
      order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : '',
      order.shipped,
      order.landingPort || '',
      order.estimatedLandingDate ? new Date(order.estimatedLandingDate).toLocaleDateString() : '',
      order.withPacking ? 'Yes' : 'No',
      order.masterCartonSize || '',
      ...(userRole !== 'supplier' ? [order.supplier?.username || ''] : [])
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 8, cellWidth: 'wrap' },
      headStyles: { halign: 'center' },
      columnStyles: headers.reduce((acc, col, i) => {
        acc[i] = { cellWidth: 'auto' };
        return acc;
      }, {})
    });

    doc.save('orders_export.pdf');
  };

  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      await HttpService.put(`/api/orders/${updatedOrder._id}`, updatedOrder);
      setShowEditModal(false);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-heading">Order Dashboard / Report</h2>
        <div className="right-actions">
          {userRole === 'admin' && (
            <button className="add-user-button" onClick={() => setShowAddUserModal(true)}>
              + Add User
            </button>
          )}
          <div className="user-info clickable" title="Logout" onClick={handleLogout}>
            <span className="username"><strong>{username}</strong></span>
            <FiLogOut className="logout-icon" />
          </div>
        </div>
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
              <option key={s.id} value={s.id}>{s.username}</option>
            ))}
          </select>
        )}

        {userRole === 'supplier' && (
          <button className="add-order-button" onClick={() => setShowCreateModal(true)}>
            + Create Order
          </button>
        )}

        <div className="export-buttons">
          <button onClick={exportToExcel} className="export-button">Export to Excel</button>
          <button onClick={exportToPDF} className="export-button">Export to PDF</button>
        </div>
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
              <th>Completion Date</th>
              <th>Shipping Mode</th>
              <th>Shipping Date</th>
              <th>Shipped</th>
              <th>Landing Port</th>
              <th>Landing Date</th>
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
                <td>{order.productionCompletionDate ? new Date(order.productionCompletionDate).toLocaleDateString() : '—'}</td>
                <td>{order.shippingMode || '—'}</td>
                <td>{order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : '—'}</td>
                <td>{order.shipped}</td>
                <td>{order.landingPort || '—'}</td>
                <td>{order.estimatedLandingDate ? new Date(order.estimatedLandingDate).toLocaleDateString() : '—'}</td>
                <td>{(userRole === 'company' || userRole === 'admin') ? (order.supplier?.username || 'N/A') : 'You'}</td>
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
      {showAddUserModal && (
        <AddUserModal onClose={() => setShowAddUserModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
