// components/product/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhaseList from './phaselist';

const ProductDetails = () => {
  const { id } = useParams(); // 👈 Get productId from URL
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    // Simulate fetch using id from route
    setPhases([{ id: 1, name: 'Phase 1' }, { id: 2, name: 'Phase 2' }]);
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Product Details (ID: {id})</h1>
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Phases</h3>
        <PhaseList phases={phases} />
      </div>
    </div>
  );
};

export default ProductDetails;
