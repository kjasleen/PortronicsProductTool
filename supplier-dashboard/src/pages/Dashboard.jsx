import React, { useState, useEffect } from 'react';
import CreateOrderModal from '../components/CreateOrderModal';
import './Dashboard.css';

const testOrders = [
  {
    id: 'ORD001',
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
    id: 'ORD002',
    productName: 'Bluetooth Speaker',
    totalOrdered: 50,
    productionStarted: 50,
    productionCompleted: 50,
    shippingStarted: 50,
    shipped: 40,
    supplier: 'XYZ Supplier',
    status: 'Shipped',
  },
  {
    id: 'ORD003',
    productName: 'Earphones',
    totalOrdered: 200,
    productionStarted: 0,
    productionCompleted: 0,
    shippingStarted: 0,
    shipped: 0,
    supplier: 'ABC Supplier',
    status: 'Pending',
  },
];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('supplier'); // or 'company'

  useEffect(() => {
    setOrders(testOrders);
    setFiltered(testOrders);
  }, []);

  useEffect(() => {
    if (statusFilter === '') {
      setFiltered(orders);
    } else {
      setFiltered(orders.filter(o => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleCreateOrder = (newOrder) => {
    const newEntry = {
      ...newOrder,
      id: `ORD${orders.length + 1}`,
      productionStarted: 0,
      productionCompleted: 0,
      shippingStarted: 0,
      shipped: 0,
      status: 'Pending',
    };
    const updatedOrders = [...orders, newEntry];
    setOrders(updatedOrders);
    setFiltered(updatedOrders);
    setShowModal(false);
  };

  const handleStageChange = (id, field, value) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, [field]: Number(value) } : order
    );
    setOrders(updated);
    setFiltered(updated);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Order Dashboard / Report</h2>

      <div className="controls">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Production Started">Production Started</option>
          <option value="Shipped">Shipped</option>
        </select>

        {userRole === 'supplier' && (
          <button className="add-order-button" onClick={() => setShowModal(true)}>
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
              <th>Production Completed</th>
              <th>Shipping Started</th>
              <th>Shipped</th>
              <th>Status</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.productName}</td>
                <td>{order.totalOrdered}</td>

                {/* Editable fields */}
                {userRole === 'supplier' ? (
                  <>
                    <td>
                      <input
                        type="number"
                        value={order.productionStarted}
                        onChange={(e) => handleStageChange(order.id, 'productionStarted', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={order.productionCompleted}
                        onChange={(e) => handleStageChange(order.id, 'productionCompleted', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={order.shippingStarted}
                        onChange={(e) => handleStageChange(order.id, 'shippingStarted', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={order.shipped}
                        onChange={(e) => handleStageChange(order.id, 'shipped', e.target.value)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{order.productionStarted}</td>
                    <td>{order.productionCompleted}</td>
                    <td>{order.shippingStarted}</td>
                    <td>{order.shipped}</td>
                  </>
                )}

                <td>{order.status}</td>
                <td>{order.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateOrderModal onClose={() => setShowModal(false)} onCreate={handleCreateOrder} />
      )}
    </div>
  );
};

export default Dashboard;
