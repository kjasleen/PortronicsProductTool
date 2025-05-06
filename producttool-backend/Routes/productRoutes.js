const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const allowRoles = require('../Middleware/roleMiddleware');
const {
  createProduct,
  deleteProduct,
  getAllProducts
} = require('../Controllers/productController');

// Only Admins can create or delete
router.post('/', authMiddleware, allowRoles(['Admin']), createProduct);
router.delete('/:id', authMiddleware, allowRoles(['Admin']), deleteProduct);

// All users can view
router.get('/', authMiddleware, getAllProducts);

module.exports = router;
