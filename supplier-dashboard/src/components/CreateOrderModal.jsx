import React, { useEffect, useState } from 'react';
import HttpService from '../Utils/HttpService';
import './CreateOrderModal.css';

export default function CreateOrderModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    productId: '',
    productName: '',
    totalOrdered: '',
    supplier: '',
  });

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    superCategory: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
    const supplierName = localStorage.getItem('supplierName');
    setForm((prev) => ({ ...prev, supplier: supplierName || '' }));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await HttpService.get('/api/products');
      setAllProducts(res);
      setFilteredProducts(res);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const filtered = allProducts.filter((product) => {
      const matchesCategory = updatedFilters.category
        ? product.category === updatedFilters.category
        : true;
      const matchesSuperCategory = updatedFilters.superCategory
        ? product.superCategory === updatedFilters.superCategory
        : true;
      const matchesSearch = updatedFilters.search
        ? product.productName.toLowerCase().includes(updatedFilters.search.toLowerCase()) ||
          product.sku.toLowerCase().includes(updatedFilters.search.toLowerCase())
        : true;
      return matchesCategory && matchesSuperCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'productId') {
      const selectedProduct = allProducts.find((p) => p._id === value);
      if (selectedProduct) {
        setForm((prev) => ({ ...prev, productName: selectedProduct.productName }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || !form.totalOrdered || !form.supplier) {
      alert('Please fill all required fields');
      return;
    }
    onCreate(form);
  };

  const categories = [...new Set(allProducts.map((p) => p.category))];
  const superCategories = [...new Set(allProducts.map((p) => p.superCategory))];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Super Category:</label>
            <select name="superCategory" value={filters.superCategory} onChange={handleFilterChange}>
              <option value="">All</option>
              {superCategories.map((scat) => (
                <option key={scat} value={scat}>{scat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Search by Name/SKU:</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Type product name or SKU"
            />
          </div>

          <div className="form-group">
            <label>Select Product:</label>
            <select name="productId" value={form.productId} onChange={handleChange}>
              <option value="">-- Select Product --</option>
              {filteredProducts.map((p, index) => (
                <option key={p._id || p.sku || index} value={p._id}>
                  {p.productName} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Total Ordered:</label>
            <input
              type="number"
              name="totalOrdered"
              min="1"
              value={form.totalOrdered}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Supplier:</label>
            <input type="text" name="supplier" value={form.supplier} disabled />
          </div>

          <div className="button-row">
            <button type="submit">Create Order</button>
            <button type="button" onClick={() => {
    console.log('Cancel clicked');
    onClose();
  }} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
