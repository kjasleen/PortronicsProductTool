import React, { useState } from 'react';
import './EditOrderModal.css';

const EditOrderModal = ({ order, onClose, onSave }) => {
  const [productionStarted, setProductionStarted] = useState(order.productionStarted || 0);
  const [shipped, setShipped] = useState(order.shipped || 0);

  const [productionStartedDate, setProductionStartedDate] = useState(order.productionStartedDate || '');
  const [estimatedProductionCompletionDate, setEstimatedProductionCompletionDate] = useState(order.estimatedProductionCompletionDate || '');
  const [shippingDate, setShippingDate] = useState(order.shippingDate || '');

  const totalOrdered = order.totalOrdered || 0;
  const isValid = productionStarted + shipped <= totalOrdered;

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
      estimatedProductionCompletionDate,
      shippingDate,
      status:
        shipped > 0
          ? 'Shipped'
          : productionStarted > 0
          ? 'Production Started'
          : 'Pending',
    };
    onSave(updatedOrder);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Order Status</h3>
        <p>Total Ordered: <strong>{totalOrdered}</strong></p>

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
            <td>
              {productionStartedDate ? (
                <span>{productionStartedDate}</span>
              ) : (
                <span style={{ color: '#888' }}>–</span>
              )}
            </td>
          </tr>

          <tr>
            <td>Est. Production Completion</td>
            <td colSpan="2">
              <input
                type="date"
                value={estimatedProductionCompletionDate}
                onChange={(e) => setEstimatedProductionCompletionDate(e.target.value)}
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
            <td>
              {shippingDate ? (
                <span>{shippingDate}</span>
              ) : (
                <span style={{ color: '#888' }}>–</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>


        <p className={isValid ? 'valid' : 'invalid'}>
          Assigned Total: {productionStarted + shipped} / {totalOrdered}
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
