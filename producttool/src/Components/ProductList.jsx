import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';
import ReactDOM from 'react-dom';
import HttpService from '../Utils/HttpService';

const DropdownMenu = ({ children, targetRef, onClose }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!targetRef?.current) return null;

  const rect = targetRef.current.getBoundingClientRect();
  const style = {
    position: 'absolute',
    top: rect.bottom + window.scrollY,
    left: rect.right - 160 + window.scrollX,
    zIndex: 1000,
  };

  return ReactDOM.createPortal(
    <div ref={menuRef} style={style} className="bg-white rounded-md shadow-lg w-40 text-sm">
      {children}
    </div>,
    document.body
  );
};

const ProductList = ({ products, title, noProductsMessage, onRefresh }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [copyModal, setCopyModal] = useState({ open: false, productId: null });
  const [copyName, setCopyName] = useState('');
  const dropdownRef = useRef(null);
  const buttonRefs = useRef({});

  const handleClick = (product) => navigate(`/products/${product._id}`);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await HttpService.delete(`/api/products/${productId}`);
      onRefresh();
    } catch (error) {
      alert('Error deleting product');
      console.error(error);
    }
  };

  const handleViewReport = (productId) => navigate(`/report/${productId}`);

  const handleProductUpdate = async (productId) => {
    try {
      await HttpService.patch('/api/products/update', {id: productId,status: 'Completed'});
      onRefresh();
    } catch (error) {
      alert('Error updating product');
      console.error(error);
    }
  };

  const openCopyModal = (productId) => {
    setCopyModal({ open: true, productId });
    setCopyName('');
    setDropdownOpen(null);
  };

  const handleCopySubmit = async () => {
    const { productId } = copyModal;
    if (!copyName.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      const data = await HttpService.get(`/api/products/report/${productId}`);
      const { phases } = data;

      const newProductRes = await HttpService.post(`/api/products/create`, {
        name: copyName,
      });

      const newProductId = newProductRes._id;

      for (const phase of phases) {
        const newPhaseRes = await HttpService.post(`/api/phases/create`, {
          name: phase.name,
          productId: newProductId,
        });

        const newPhaseId = newPhaseRes._id;

        for (const task of phase.tasks) {
          await HttpService.post(`/api/tasks/create`, {
            name: task.name,
            phaseId: newPhaseId,
            estimatedCompletionDate: task.estimatedCompletionDate,
          });
        }
      }

      alert('New Product Created Successfully!');
      setCopyModal({ open: false, productId: null });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to make a copy');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-left">{title}</h2>

      {products.length === 0 ? (
        <p className="text-2xl text-blue-400">{noProductsMessage}</p>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {products.map((product) => {
            buttonRefs.current[product._id] ||= React.createRef();

            return (
              <div
                key={product._id}
                onClick={() => handleClick(product)}
                className="relative shrink-0 w-44 h-44 bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl shadow-md flex items-center justify-center text-xl font-semibold text-blue-900 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer group"
              >
                {product.name}

                <div className="absolute bottom-2 right-2 z-10" ref={dropdownRef}>
                  <button
                    ref={buttonRefs.current[product._id]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === product._id ? null : product._id);
                    }}
                    className="text-gray-600 hover:text-black focus:outline-none !bg-transparent border-none p-0 m-0"
                    title="More options"
                  >
                    <FiMoreHorizontal size={20} />
                  </button>

                  {dropdownOpen === product._id && (
                    <DropdownMenu
                      targetRef={buttonRefs.current[product._id]}
                      onClose={() => setDropdownOpen(null)}
                    >
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">Delete</button>
                      <button onClick={(e) => { e.stopPropagation(); handleViewReport(product._id); }} className="block w-full text-left px-4 py-2 hover:bg-blue-100 text-blue-600">View Report</button>
                      <button onClick={(e) => { e.stopPropagation(); openCopyModal(product._id); }} className="block w-full text-left px-4 py-2 hover:bg-green-100 text-green-600">Make a Copy</button>
                      <button onClick={(e) => { e.stopPropagation(); handleProductUpdate(product._id); }} className="block w-full text-left px-4 py-2 hover:bg-green-100 text-green-600">Mark as Complete</button>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Copy Modal */}
      {copyModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Copy Product</h3>
            <input
              type="text"
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              placeholder="Enter new product name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCopyModal({ open: false, productId: null })}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCopySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
