const express = require('express');
const router = express.Router();
const { authMiddleware, allowRoles } = require('../Middleware/authMiddleware');
const {
  createProduct,
  deleteProduct,
  getAllProducts
} = require('../Controllers/productController');

// Only Admins can create or delete
router.post('/create', authMiddleware, allowRoles(['Admin']), createProduct);
router.delete('/delete:id', authMiddleware, allowRoles(['Admin']), deleteProduct);

// All users can view
router.get('/', authMiddleware, getAllProducts);

module.exports = router;
