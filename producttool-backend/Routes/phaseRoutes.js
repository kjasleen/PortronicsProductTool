const express = require('express');
const router = express.Router();
const { authMiddleware, allowRoles } = require('../Middleware/authMiddleware');
const {
  createPhase,
  deletePhase,
  getPhasesByProduct
} = require('../Controllers/phaseController');

// Only Admin can add/remove phase
router.post('/create', authMiddleware, allowRoles(['Admin']), createPhase);
router.delete('/:id', authMiddleware, allowRoles(['Admin']), deletePhase);

// Anyone logged in can view phases of a product
router.get('/:productId', authMiddleware, getPhasesByProduct);

module.exports = router;
