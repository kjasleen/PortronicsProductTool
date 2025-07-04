import React, { useEffect, useState } from 'react';
import HttpService from '../Utils/HttpService';
import './CreateOrderModal.css';

export default function CreateOrderModal({ onClose, onCreate, vendors }) {
  const [form, setForm] = useState({
    productId: '',
    totalOrdered: '',
    withPacking: false,
    masterCartonSize: '',
    supplierId: '',
  });

  const [hierarchy, setHierarchy] = useState([]);
  const [selectedSuperCategory, setSelectedSuperCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchHierarchy();
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const fetchHierarchy = async () => {
    try {
      const res = await HttpService.get('/api/products/hierarchy');
      setHierarchy(res);
    } catch (err) {
      console.error('Failed to fetch hierarchy', err);
    }
  };

  const handleSuperCategoryChange = (e) => {
    const id = e.target.value;
    setSelectedSuperCategory(id);
    const sc = hierarchy.find((h) => h.superCategoryId === id);
    setFilteredCategories(sc ? sc.categories : []);
    setFilteredProducts([]);
    setSelectedCategory('');
    setForm((prev) => ({ ...prev, productId: '' }));
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setSelectedCategory(id);
    const cat = filteredCategories.find((c) => c.categoryId === id);
    setFilteredProducts(cat ? cat.products : []);
    setForm((prev) => ({ ...prev, productId: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || !form.totalOrdered || !form.supplierId) {
      alert('Please fill all required fields.');
      return;
    }
    onCreate(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          <div className="form-group">
            <label>Vendor:</label>
            <select name="supplierId" value={form.supplierId} onChange={handleChange} required>
              <option value="">-- Select Vendor --</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>{v.username}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Super Category:</label>
            <select value={selectedSuperCategory} onChange={handleSuperCategoryChange}>
              <option value="">-- Select Super Category --</option>
              {hierarchy.map((sc) => (
                <option key={sc.superCategoryId} value={sc.superCategoryId}>{sc.superCategory}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select value={selectedCategory} onChange={handleCategoryChange} disabled={!selectedSuperCategory}>
              <option value="">-- Select Category --</option>
              {filteredCategories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product:</label>
            <select name="productId" value={form.productId} onChange={handleChange} disabled={!selectedCategory}>
              <option value="">-- Select Product --</option>
              {filteredProducts.map((p) => (
                <option key={p.productId} value={p.productId}>{p.productName} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Ordered:</label>
              <input type="number" name="totalOrdered" min="1" value={form.totalOrdered} onChange={handleChange} />
            </div>

            <div className="form-group checkbox-align">
              <label className="checkbox-label">
                <input type="checkbox" name="withPacking" checked={form.withPacking} onChange={handleChange} />
                With Packing
              </label>
            </div>

            <div className="form-group">
              <label>Master Carton Size:</label>
              <input type="number" name="masterCartonSize" min="1" value={form.masterCartonSize} onChange={handleChange} />
            </div>
          </div>

          <div className="button-row">
            <button type="submit">Create Order</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
