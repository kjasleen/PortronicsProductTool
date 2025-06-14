import React, { useState } from 'react';
import '../Dashboard.css';

const stageFieldMap = {
  'Production Started': 'productionStarted',
  'Production Completed': 'productionCompleted',
  'Shipping Started': 'shippingStarted',
  'Shipped': 'shipped',
};

const stageOptions = Object.keys(stageFieldMap);

export default function EditModal({ order, onSave, onCancel }) {
  const [selectedStage, setSelectedStage] = useState(stageOptions[0]);
  const [quantity, setQuantity] = useState(order[stageFieldMap[selectedStage]] || 0);

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    setSelectedStage(newStage);
    setQuantity(order[stageFieldMap[newStage]] || 0); // update value shown
  };

  const handleSave = () => {
    const fieldToUpdate = stageFieldMap[selectedStage];
    const updatedOrder = { ...order, [fieldToUpdate]: quantity };
    onSave(updatedOrder); // backend recalculates status
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Stage Quantity</h2>

        <label>
          Stage:
          <select value={selectedStage} onChange={handleStageChange}>
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity:
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
