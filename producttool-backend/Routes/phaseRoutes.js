const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const allowRoles = require('../Middleware/roleMiddleware');
const {
  createPhase,
  deletePhase,
  getPhasesByProduct
} = require('../Controllers/phaseController');

// Only Admin can add/remove phase
router.post('/', authMiddleware, allowRoles(['Admin']), createPhase);
router.delete('/:id', authMiddleware, allowRoles(['Admin']), deletePhase);

// Anyone logged in can view phases of a product
router.get('/product/:productId', authMiddleware, getPhasesByProduct);

module.exports = router;
