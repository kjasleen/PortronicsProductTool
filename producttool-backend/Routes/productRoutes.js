const express = require('express');
const router = express.Router();
const { authMiddleware, allowRoles } = require('../Middleware/authMiddleware');
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductReport,
  updateProduct
} = require('../Controllers/productController');

// Only Admins can create or delete
router.post('/create', authMiddleware, allowRoles(['Admin']), createProduct);
router.delete('/:id', authMiddleware, allowRoles(['Admin']), deleteProduct);
router.patch('/update', authMiddleware, allowRoles(['Admin']), updateProduct);

// All users can view
router.get('/', authMiddleware, getAllProducts);
router.get('/report/:productId', authMiddleware, getProductReport);

module.exports = router;
