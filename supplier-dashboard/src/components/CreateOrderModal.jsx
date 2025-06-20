import React, { useEffect, useState } from 'react';
import HttpService from '../Utils/HttpService';
import './CreateOrderModal.css';

export default function CreateOrderModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    productId: '',
    productName: '',
    totalOrdered: '',
    withPacking: false,
    masterCartonSize: '',
  });

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    superCategory: '',
  });

  useEffect(() => {
      fetchProducts();

      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, [onClose]);


  const fetchProducts = async () => {
    try {
      const res = await HttpService.get('/api/products');
      const normalized = res.map((p) => ({
        _id: p._id,
        productName: p["Product Name"],
        sku: p.SKU,
        category: p.Category,
        superCategory: p["Super Category"],
      }));

      setAllProducts(normalized);
      setFilteredProducts(normalized);

      const categories = [...new Set(normalized.map((p) => p.category))];
      setFilteredCategories(categories);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    if (name === 'superCategory') {
      const newCategories = [
        ...new Set(
          allProducts
            .filter((p) => value === '' || p.superCategory === value)
            .map((p) => p.category)
        ),
      ];
      setFilteredCategories(newCategories);
      updatedFilters.category = '';
    }

    const filtered = allProducts.filter((product) => {
      const matchSC = updatedFilters.superCategory
        ? product.superCategory === updatedFilters.superCategory
        : true;
      const matchCat = updatedFilters.category
        ? product.category === updatedFilters.category
        : true;
      return matchSC && matchCat;
    });

    setFilteredProducts(filtered);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'productId') {
      const selectedProduct = allProducts.find((p) => p._id === value);
      if (selectedProduct) {
        setForm((prev) => ({ ...prev, productName: selectedProduct.productName }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || !form.totalOrdered) {
      alert('Please fill all required fields');
      return;
    }
    onCreate(form);
  };

  const superCategories = [...new Set(allProducts.map((p) => p.superCategory))];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit} className="form-grid">
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
            <label>Category:</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              {filteredCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Product:</label>
            <select name="productId" value={form.productId} onChange={handleChange}>
              <option value="">-- Select Product --</option>
              {filteredProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Flex Row: Total Ordered, With Packing, Master Carton Size */}
          <div className="form-row">
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

          <div className="form-group checkbox-align">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="withPacking"
                checked={form.withPacking}
                onChange={handleChange}
              />
              With Packing
            </label>
          </div>



            <div className="form-group">
              <label>Master Carton Size:</label>
              <input
                type="number"
                name="masterCartonSize"
                min="1"
                value={form.masterCartonSize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-row">
            <button type="submit">Create Order</button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
