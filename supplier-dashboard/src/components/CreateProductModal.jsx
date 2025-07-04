import React, { useEffect, useState } from 'react';
import HttpService from '../Utils/HttpService';
import './CreateProductModal.css';

export default function CreateProductModal({ onClose, onCreate }) {
  const [superCategories, setSuperCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSuperCategoryId, setSelectedSuperCategoryId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [form, setForm] = useState({
    productName: '',
    sku: '',
  });

  const [newSuperCategoryName, setNewSuperCategoryName] = useState('');
  const [showAddSuperCategory, setShowAddSuperCategory] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    fetchSuperCategories();

    // ✅ Add Esc key listener
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const fetchSuperCategories = async () => {
    try {
      const res = await HttpService.get('/api/products/super-categories');
      setSuperCategories(res);
    } catch (err) {
      console.error('Failed to fetch super categories', err);
    }
  };

  const fetchCategories = async (superCategoryId) => {
    try {
      const res = await HttpService.get(`/api/products/categories?superCategoryId=${superCategoryId}`);
      setCategories(res);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleSuperCategoryChange = (e) => {
    const id = e.target.value;
    setSelectedSuperCategoryId(id);
    setSelectedCategoryId('');
    if (id) fetchCategories(id);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const addNewSuperCategory = async () => {
    if (!newSuperCategoryName) return;
    try {
      const newSC = await HttpService.post('/api/products/super-categories', { name: newSuperCategoryName });
      setNewSuperCategoryName('');
      setShowAddSuperCategory(false);
      await fetchSuperCategories();
      setSelectedSuperCategoryId(newSC._id);
      fetchCategories(newSC._id);
    } catch (err) {
      console.error('Error adding super category', err);
    }
  };

  const addNewCategory = async () => {
    if (!newCategoryName || !selectedSuperCategoryId) return;
    try {
      const newCat = await HttpService.post('/api/products/categories', {
        name: newCategoryName,
        superCategoryId: selectedSuperCategoryId,
      });
      setNewCategoryName('');
      setShowAddCategory(false);
      await fetchCategories(selectedSuperCategoryId);
      setSelectedCategoryId(newCat._id);
    } catch (err) {
      console.error('Error adding category', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.sku || !selectedSuperCategoryId || !selectedCategoryId) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      await HttpService.post('/api/products/products', {
        productName: form.productName,
        sku: form.sku,
        superCategoryId: selectedSuperCategoryId,
        categoryId: selectedCategoryId,
      });
      onCreate();
      onClose();
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Product</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          <div className="form-group-row">
            <div className="form-group flex-grow">
              <label>Super Category:</label>
              <select value={selectedSuperCategoryId} onChange={handleSuperCategoryChange}>
                <option value="">-- Select Super Category --</option>
                {superCategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>{sc.name}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => setShowAddSuperCategory(!showAddSuperCategory)}>Add New</button>
          </div>

          {showAddSuperCategory && (
            <div className="form-group">
              <input
                type="text"
                placeholder="New Super Category Name"
                value={newSuperCategoryName}
                onChange={(e) => setNewSuperCategoryName(e.target.value)}
              />
              <button type="button" onClick={addNewSuperCategory}>Save Super Category</button>
            </div>
          )}

          <div className="form-group-row">
            <div className="form-group flex-grow">
              <label>Category:</label>
              <select value={selectedCategoryId} onChange={handleCategoryChange} disabled={!selectedSuperCategoryId}>
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              disabled={!selectedSuperCategoryId}
            >
              Add New
            </button>
          </div>

          {showAddCategory && (
            <div className="form-group">
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="button" onClick={addNewCategory}>Save Category</button>
            </div>
          )}

          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>SKU:</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
            />
          </div>

          <div className="button-row">
            <button type="submit">Create Product</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
