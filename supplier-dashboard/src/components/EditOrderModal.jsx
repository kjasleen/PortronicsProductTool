import React, { useState, useEffect } from 'react';
import './EditOrderModal.css';

const EditOrderModal = ({ order, onClose, onSave }) => {
  const formatDate = (iso) => (iso ? iso.slice(0, 10) : '');

  const [productionCompletionDate, setProductionCompletionDate] = useState(formatDate(order.productionCompletionDate));
  const [productionStartedDate, setProductionStartedDate] = useState(formatDate(order.productionStartedDate));
  const [shippingDate, setShippingDate] = useState(formatDate(order.shippingDate));
  const [estimatedLandingDate, setEstimatedLandingDate] = useState(formatDate(order.estimatedLandingDate));
  const [productionStarted, setProductionStarted] = useState(order.productionStarted || 0);
  const [shipped, setShipped] = useState(order.shipped || 0);
  const [shippingMode, setShippingMode] = useState(order.shippingMode || '');
  const [landingPort, setLandingPort] = useState(order.landingPort || '');
  const [userRole, setUserRole] = useState('');

  const totalOrdered = order.totalOrdered || 0;

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleProductionChange = (value) => {
    const num = Number(value);
    setProductionStarted(num);
    if (num > 0 && !productionStartedDate) {
      setProductionStartedDate(new Date().toISOString().slice(0, 10));
    } else if (num === 0) {
      setProductionStartedDate('');
    }
  };

  const handleShippedChange = (value) => {
    const num = Number(value);
    setShipped(num);
    if (num > 0 && !shippingDate) {
      setShippingDate(new Date().toISOString().slice(0, 10));
    } else if (num === 0) {
      setShippingDate('');
    }
  };

  const handleSave = () => {
    const updatedOrder = {
      ...order,
      productionStarted,
      shipped,
      productionStartedDate,
      productionCompletionDate,
      shippingDate,
      shippingMode,
      landingPort,
      estimatedLandingDate,
      status:
        shipped > 0
          ? 'Shipped'
          : productionStarted > 0
          ? 'Production Started'
          : 'Pending',
    };
    onSave(updatedOrder);
  };

  const isValid =
    productionStarted <= totalOrdered &&
    shipped <= productionStarted &&
    productionStarted >= 0 &&
    shipped >= 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Order Status</h3>
        <p>Total Ordered: <strong>{totalOrdered}</strong></p>

        {userRole === 'supplier' && (
          <table className="status-quantity-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Production Started</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={productionStarted}
                    onChange={(e) => handleProductionChange(e.target.value)}
                  />
                </td>
                <td>{productionStartedDate || <span style={{ color: '#888' }}>–</span>}</td>
              </tr>
              <tr>
                <td>Completion Date</td>
                <td colSpan="2">
                  <input
                    type="date"
                    value={productionCompletionDate}
                    onChange={(e) => setProductionCompletionDate(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Shipped</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={shipped}
                    onChange={(e) => handleShippedChange(e.target.value)}
                  />
                </td>
                <td>{shippingDate || <span style={{ color: '#888' }}>–</span>}</td>
              </tr>
            </tbody>
          </table>
        )}

        {userRole === 'admin' && (
          <div className="date-fields">
            <label>
              Shipping Mode (Air/Sea)
              <select value={shippingMode} onChange={(e) => setShippingMode(e.target.value)}>
                <option value="">Select Mode</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
              </select>
            </label>

            <label>
              Landing Port
              <select value={landingPort} onChange={(e) => setLandingPort(e.target.value)}>
                <option value="">Select Port</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
              </select>
            </label>

            <label>
              Estimated Landing Date
              <input
                type="date"
                value={estimatedLandingDate}
                onChange={(e) => setEstimatedLandingDate(e.target.value)}
              />
            </label>
          </div>
        )}

        <p>
          Production Started: <strong>{productionStarted} / {totalOrdered}</strong>
        </p>
        <p>
          Shipped: <strong>{shipped} / {productionStarted}</strong>
        </p>
        <p className={isValid ? 'valid' : 'invalid'}>
          {isValid ? 'Quantities look good ✅' : '⚠️ Please correct quantities'}
        </p>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button onClick={handleSave} disabled={!isValid}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
